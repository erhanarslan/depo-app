import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Product, Shelf, Warehouse } from '../../interfaces/models';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AddShelfDialogComponent } from '../add-shelf-dialog/add-shelf-dialog.component';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import { WarehouseService } from '../../services/warehouse.service';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-warehouse-section',
  standalone: true,
  imports: [CommonModule, MatDialogModule, HttpClientModule, MatTableModule, MatButtonModule, AddProductDialogComponent, MatIconModule, UpdateProductComponent],
  templateUrl: './warehouse-section.component.html',
  styleUrls: ['./warehouse-section.component.scss']
})
export class WarehouseSectionComponent implements OnInit, OnDestroy {
  @Input() warehouseName: string = '';
  shelves: Shelf[] = [];
  warehouses: Warehouse[] = [];
  filteredWarehouses: Warehouse[] = [];
  products: Product[] = [];
  displayedColumns: string[] = ['reyon', 'tur', 'urunler', 'actions'];
  private searchSubscription?: Subscription;

  constructor(
    private dialog: MatDialog,
    private warehouseService: WarehouseService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.loadData();
    this.searchSubscription = this.searchService.currentSearchTerm.subscribe(term => {
      this.filterData(term);
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  private filterData(searchTerm: string) {
    if (!searchTerm) {
      this.filteredWarehouses = this.warehouses;
      return;
    }

    this.filteredWarehouses = this.warehouses.map(warehouse => ({
      ...warehouse,
      shelves: warehouse.shelves.filter(shelf => 
        shelf.name.toLowerCase().includes(searchTerm) ||
        shelf.type.toLowerCase().includes(searchTerm) ||
        shelf.products.some(product => 
          product.name.toLowerCase().includes(searchTerm)
        )
      )
    }));
  }

  private loadData() {    
    this.warehouseService.getWarehousesWithShelvesAndProducts()
      .subscribe(data => {
        this.warehouses = data;
        this.filteredWarehouses = data;
      });
  }

  openAddShelfDialog(warehouse: Warehouse) {
    const lastShelf = warehouse.shelves[warehouse.shelves.length - 1];
    const lastShelfNumber = lastShelf ? parseInt(lastShelf.name.substring(1)) : 0;
    const newShelfName = `R${lastShelfNumber + 1}`;

    const dialogRef = this.dialog.open(AddShelfDialogComponent, {
      width: '400px',
      data: { warehouse: warehouse, shelfName: newShelfName }
    });

    dialogRef.afterClosed().subscribe((result: Shelf) => {
      if (result) {
        this.warehouseService.addShelf(result).subscribe(() => {
          this.loadData();
        });

      }
    });
  }

  deleteShelf(id: number) {
    this.warehouseService.deleteShelf(id).subscribe(
      () => this.loadData(),
      (error) => console.error('Error occurred:', error)
    );
  }

  openAddProductDialog(shelf: Shelf) {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '400px',
      data: {
        shelfName: shelf.name,
        shelfId: shelf.id
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.warehouseService.addProduct(result).subscribe(() => {
          this.loadData();
        });
      }
    });
  }

  openUpdateProductDialog(product: Product) {
    const dialogRef = this.dialog.open(UpdateProductComponent, {
      width: '400px',
      data: {
        id: product.id,
        name: product.name,
        shelfId: product.shelfId,
        warehouses: this.warehouses,
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result === 'delete') {
        this.loadData();
      } else if (result) {
        const updatedProduct: Product = {
          id: result.id,
          name: result.name,
          shelfId: result.targetShelf,
        };
        this.warehouseService.updateProduct(updatedProduct)
          .subscribe(() => {
            this.loadData();
          });
      }
    });
  }
}
