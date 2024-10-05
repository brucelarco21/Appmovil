import { Component } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { PopoverController, AlertController } from '@ionic/angular';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { ChangeDetectorRef } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [BarcodeScanner]
})
export class HomePage {
  email: string = '';
  password: string = ''; // Para almacenar la contraseña
  selectedIngredients: string[] = [];
  ingredients: string[] = [
    'Carne molida de res',
    'Aguacate',
    'Pollo',
    'Pescado',
    'Arroz',
    'Frijoles',
    'Vegetales',
  ];
  scannedCode: string = '';

  constructor(
    private router: Router, 
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService,
    private popoverController: PopoverController,
    private cd: ChangeDetectorRef,
    private barcodeScanner: BarcodeScanner,
    private alertController: AlertController
  ) {}

  async ngOnInit() { 
    await this.loadData();
  }

  async loadData() {
    const user = await this.storageService.getUser(); // Usar el nuevo método
    this.email = user.email || ''; // Asegúrate de que email nunca sea undefined
  }

  toggleIngredient(ingredient: string) {
    const index = this.selectedIngredients.indexOf(ingredient);
    if (index > -1) {
      this.selectedIngredients.splice(index, 1); // Eliminar ingrediente si ya está seleccionado
    } else {
      this.selectedIngredients.push(ingredient); // Agregar ingrediente si no está seleccionado
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

  // Función para escanear código de barras
  async scanBarcode() {
    try {
      const barcodeData = await this.barcodeScanner.scan();
      this.scannedCode = barcodeData.text;
      if (this.scannedCode) {
        const alert = await this.alertController.create({
          header: 'Producto añadido',
          message: `Código de barras escaneado: ${this.scannedCode}`,
          buttons: ['OK']
        });
        await alert.present();

        // Añade el producto a la lista
        this.addProductToList(this.scannedCode);
      }
    } catch (err) {
      console.log('Error al escanear el código de barras:', err);
    }
  }

  // Función para añadir el producto escaneado a la lista de ingredientes seleccionados
  addProductToList(barcode: string) {
    const product = `Producto con código ${barcode}`;
    if (!this.selectedIngredients.includes(product)) {
      this.selectedIngredients.push(product);
    } else {
      this.alertDuplicateProduct();
    }
  }

  // Función para alertar al usuario si el producto ya está en la lista
  async alertDuplicateProduct() {
    const alert = await this.alertController.create({
      header: 'Producto duplicado',
      message: 'Este producto ya ha sido añadido a la lista.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
