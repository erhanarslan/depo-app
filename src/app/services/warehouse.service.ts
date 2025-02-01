import { Injectable } from '@angular/core';
import { forkJoin, map, Observable} from 'rxjs';
import { Warehouse, Shelf, Product } from '../interfaces/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

    getWarehousesWithShelvesAndProducts(): Observable<any[]> {
      return forkJoin([
        this.http.get<Warehouse[]>(`${this.apiUrl}/warehouses`),
        this.http.get<Shelf[]>(`${this.apiUrl}/shelves`),
        this.http.get<Product[]>(`${this.apiUrl}/products`)
      ]).pipe(
        map(([warehouses, shelves, products]) => {
          return warehouses.map(warehouse => {
            const filteredShelves = shelves.filter(shelf => Number(shelf.warehouseId) === Number(warehouse.id));
            return {
              ...warehouse,
              shelves: filteredShelves.map(shelf => ({
                ...shelf,
                products: products.filter(product => Number(product.shelfId) === Number(shelf.id))
              }))
            };
          });
        })
      );
    }

    getShelves(): Observable<Shelf[]> {
      return this.http.get<Shelf[]>(`${this.apiUrl}/shelves`);
    }
  
    addShelf(shelf: Omit<Shelf, 'id'>): Observable<Shelf> {
      return this.http.post<Shelf>(`${this.apiUrl}/shelves`, shelf);
    }
  
    deleteShelf(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/shelves/${id}`);
    }
  
    addProduct(product: Omit<Product, 'id'>): Observable<Product> {
      return this.http.post<Product>(`${this.apiUrl}/products`, product);
    }
  
    updateProduct(product: Product): Observable<Product> {
      return this.http.put<Product>(`${this.apiUrl}/products/${product.id}`, product);
    }
  
    deleteProduct(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
    }
}
