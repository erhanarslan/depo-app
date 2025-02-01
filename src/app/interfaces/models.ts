export interface Warehouse {
  id: number;
  name: string;
  shelves: Shelf[];
}

export interface Shelf {
  id: number;
  name: string;
  type: string;
  warehouseId: number;
  products: Product[]; 
}

export interface Product {
  id: number;
  name: string;
  shelfId: number;
}
