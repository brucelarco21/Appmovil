import { Component } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { PopoverController } from '@ionic/angular';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { ChangeDetectorRef } from '@angular/core'; // Importa ChangeDetectorRef

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  email: string = '';  
  selectedIngredients: string[] = []; // Para almacenar los ingredientes seleccionados
  ingredients: string[] = [
    'Carne molida de res',
    'Aguacate',
    'Pollo',
    'Pescado',
    'Arroz',
    'Frijoles',
    'Vegetales',
    // Agrega más ingredientes según sea necesario
  ];

  constructor(
    private router: Router, 
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService,
    private popoverController: PopoverController,
    private cd: ChangeDetectorRef // Inyecta ChangeDetectorRef
  ) {}

  async ngOnInit() { 
    this.loadData();
  }

  async loadData() {
    const userEmail = await this.storageService.get('userEmail');
    this.email = userEmail;
  }

  toggleIngredient(ingredient: string) {
    const index = this.selectedIngredients.indexOf(ingredient);
    if (index > -1) {
      this.selectedIngredients.splice(index, 1); // Si el ingrediente ya está seleccionado, lo eliminamos
    } else {
      this.selectedIngredients.push(ingredient); // Si no está seleccionado, lo agregamos
    }
  }

  async onSignOutButtonPressed() {
    this.cancelAlertService.showAlert(
      'Cerrar sesión',                         
      '¿Estás seguro de que quieres cerrar sesión?',  
      async () => {
        await this.storageService.clear();     
        this.email = ''; // Limpia el email del componente
        this.cd.detectChanges(); // Forzar la actualización de la vista
        this.router.navigate(['/splash']);     
      },
      () => {
        console.log('Sesión no cerrada');
      }
    );
  }

  async presentUserMenu(event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: UserMenuComponent,
      event: event,
      translucent: true
    });
    return await popover.present();
  }

  // Funciones para la navegación del navbar superior
  goToParaTi() {
    this.router.navigate(['/para-ti']);
  }

  goToComunidad() {
    this.router.navigate(['/comunidad']);
  }

  goToNotifications() {
    this.router.navigate(['/notificaciones']);
  }

  goToUserProfile() {
    this.router.navigate(['/perfil']);
  }

  // Funciones para la navegación del footer
  goToInicio() {
    this.router.navigate(['/inicio']);
  }

  goToExplorar() {
    this.router.navigate(['/explorar']);
  }

  goToGuardada() {
    this.router.navigate(['/guardada']);
  }

  goToPlanificador() {
    this.router.navigate(['/planificador']);
  }

  goToListas() {
    this.router.navigate(['/listas']);
  }
}
