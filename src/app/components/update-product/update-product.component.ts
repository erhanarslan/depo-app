import { Warehouse } from './../../interfaces/models';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Shelf } from '../../interfaces/models';
import { HttpClient } from '@angular/common/http';
import { WarehouseService } from '../../services/warehouse.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup;
  warehouses: Warehouse[] = [];
  shelves: Shelf[] = [];
  availableShelves: Shelf[] = [];
  type: string = '';

  constructor(
    private dialogRef: MatDialogRef<UpdateProductComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private warehouseService: WarehouseService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      id: this.data.id,
      name: this.data.name,
      shelfType: '',
      warehouseName: '',
      warehouseId: '',
      targetWarehouse: '',
      targetShelf: this.data.shelfId,
    });
  }

  ngOnInit() {
    this.fetchShelves();
    this.warehouses = this.data.warehouses;
    this.productForm.get('targetWarehouse')?.valueChanges.subscribe(() => {
      this.filterAvailableShelves();
    });
  }

  fetchShelves() {
    this.warehouseService.getShelves().subscribe((shelves) => {
      this.shelves = shelves;
      let shelfById = this.shelves.filter(shelf =>
        Number(shelf.id) === Number(this.data.shelfId)
      );
      this.type = shelfById[0].type;
      this.productForm.get('shelfType')?.setValue(this.type);
      this.filterAvailableShelves();
    });
  }

  filterAvailableShelves() {
    const selectedWarehouse = this.productForm.get('targetWarehouse')?.value;
    this.availableShelves = this.shelves.filter(shelf => {
      return shelf.type === this.type && String(shelf.warehouseId) === String(selectedWarehouse);
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  deleteProduct() {
    this.warehouseService.deleteProduct(this.data.id).subscribe(() => this.dialogRef.close('delete'));
  }
}
