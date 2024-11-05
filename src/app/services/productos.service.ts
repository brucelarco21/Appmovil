import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

export interface Producto {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string; // Añadir la propiedad imagenUrl
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private dbPath = '/productos';

  constructor(private db: AngularFireDatabase) {}

  getProductos(): Observable<Producto[]> {
    return this.db.list<Producto>(this.dbPath).valueChanges();
  }

  createProducto(producto: Producto): Promise<void> {
    const productoRef = this.db.list(this.dbPath).push({}); // Crea una nueva referencia
    return productoRef.set({ ...producto, id: productoRef.key }); // Usa el key de Firebase como id
  }

  updateProducto(id: string, producto: Producto): Promise<void> {
    return this.db.list(this.dbPath).update(id, producto);
  }

  deleteProducto(id: string): Promise<void> {
    return this.db.list(this.dbPath).remove(id);
  }
}
