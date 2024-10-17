import { Component } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { RecipeService } from 'src/managers/recipeService';
import { ItemCrudService } from 'src/managers/item-crud-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any;
  recipes: any[] = []; // Array para almacenar varias recetas

  constructor(
    private router: Router,
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService,
    private recipeService: RecipeService,
    private itemCrudService: ItemCrudService
  ) {}

  async ngOnInit() {
    // Lista de palabras clave para cargar varias recetas
    const searchTerms = ['pizza', 'pasta', 'salad', 'soup', 'dessert'];
    
    // Llama a la función `loadRecipes` para cada término de búsqueda
    searchTerms.forEach(term => this.loadRecipes(term));
  }

  async ionViewDidEnter() {
    this.user = await this.storageService.get('user');
    if (!this.user) {
      console.log('No se encontraron datos del usuario.');
    }
  }

  loadRecipes(query: string) {
    this.recipeService.searchRecipes(query).subscribe({
      next: (response) => {
        if (response.meals) {
          // Añadir recetas al array existente
          this.recipes = [...this.recipes, ...response.meals];
          console.log('Recetas cargadas:', this.recipes);
        } else {
          console.log(`No se encontraron recetas para ${query}.`);
        }
      },
      error: (error) => {
        console.error('Error al obtener recetas:', error);
      }
    });
  }

  saveRecipesToFirebase() {
    this.recipes.forEach(recipe => {
      this.itemCrudService.createItem(recipe)
        .then(() => {
          console.log('Receta guardada en Firebase:', recipe.strMeal);
        })
        .catch(error => {
          console.error('Error al guardar receta en Firebase:', error);
        });
    });
  }

  onProfileButtonPressed() {
    this.router.navigate(['/profile']);
  }

  async onSignOutButtonPressed() {
    this.cancelAlertService.showAlert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      async () => {
        await this.storageService.clear();
        this.router.navigate(['/splash']);
      },
      () => {
        console.log('Sesión no cerrada');
      }
    );
  }
}
