import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'https://www.themealdb.com/api/json/v1/1/'; // URL base de TheMealDB

  constructor(private http: HttpClient) {
    console.log('Base URL:', this.baseUrl);
  }

  // Método para buscar recetas usando un query
  searchRecipes(query: string): Observable<any> {
    const url = `${this.baseUrl}search.php?s=${query}`;
    return this.http.get<any>(url);
  }

  // Método para obtener recetas por ID
  getRecipeById(id: number): Observable<any> {
    const url = `${this.baseUrl}lookup.php?i=${id}`;
    return this.http.get<any>(url);
  }
}
