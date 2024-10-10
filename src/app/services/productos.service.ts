// src/app/services/productos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://www.obuma.cl/ayuda/api-integracion/productos'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

  // Buscar productos por nombre
  buscarProductos(nombre: string): Observable<any> {
    const params = new HttpParams().set('nombre', nombre); // Ajusta la consulta según la API
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Listar productos por categoría
  listarProductosPorCategoria(categoriaId: number): Observable<any> {
    const params = new HttpParams().set('categoriaId', categoriaId.toString()); // Ajusta la consulta según la API
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo producto
  crearProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un producto
  eliminarProducto(productoId: number): Observable<any> {
    const url = `${this.apiUrl}/${productoId}`; // Ajusta la URL según la API
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Manejar errores
  private handleError(error: any) {
    console.error('Error en la solicitud', error);
    return throwError(error); // Reenvía el error para que pueda ser manejado por el componente
  }
}
