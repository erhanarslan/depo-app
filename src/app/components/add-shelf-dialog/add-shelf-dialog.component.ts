import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Shelf } from '../../interfaces/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-add-shelf-dialog',
  standalone: true,
  templateUrl: './add-shelf-dialog.component.html',
  styleUrl: './add-shelf-dialog.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
})
export class AddShelfDialogComponent {
  @Output() shelfAdded = new EventEmitter<Shelf>();
  shelfForm: FormGroup;
  shelfTypes = ['Gıda', 'Elektronik', 'Giyim', 'Kırtasiye', 'Temizlik'];
  currentShelfNumber = 1;
  shelfName: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddShelfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.shelfForm = this.fb.group({
      name: [data.shelfName, Validators.required],
      type: ['', Validators.required],
      warehouseId: [data.warehouse.id, Validators.required],
      warehouseName: data.warehouse.name
    });
    this.shelfName = data.shelfName;
  }

  ngOnChanges() {
    this.shelfForm.patchValue({ warehouseName: this.data.warehouse.name });
  }

  onSubmit() {
    if (this.shelfForm.valid) {
      const newShelf = {
        ...this.shelfForm.value,
      };
      this.dialogRef.close(newShelf);
    } else {
      console.log('Form is invalid');
    }
  }

  incrementShelfNumber() {
    this.currentShelfNumber++;
    this.shelfForm.patchValue({ name: `R${this.currentShelfNumber}` });
  }
}
