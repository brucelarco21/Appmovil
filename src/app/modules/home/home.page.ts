import { Component } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { UserLogoutUseCase } from 'src/app/use-cases/user-logout.user-case';
import { Observable } from 'rxjs';
import { ProductosService } from 'src/app/services/productos.service';
import { ModalController } from '@ionic/angular';
import { ProductoModalComponent } from 'src/app/producto-modal/producto-modal.component';
import { map } from 'rxjs/operators';

interface Producto {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any;
  productos$: Observable<Producto[]>; // Observable de productos
  searchTerm: string = ''; // Campo para el término de búsqueda
  filteredProductos$: Observable<Producto[]>; // Observable de productos filtrados

  constructor(
    private router: Router,
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService,
    private logoutUseCase: UserLogoutUseCase,
    private productosService: ProductosService,
    private modalController: ModalController
  ) {}

  async ionViewDidEnter() {
    this.user = await this.storageService.get('user');
    if (!this.user) {
      console.log('No se encontraron datos del usuario.');
    }
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productos$ = this.productosService.getProductos(); 
    this.filteredProductos$ = this.productos$; // Inicializa con todos los productos
  }

  filterProductos() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredProductos$ = this.productos$.pipe(
      map((productos) =>
        productos.filter((producto) =>
          producto.nombre.toLowerCase().includes(searchTermLower)
        )
      )
    );
  }

  async agregarProducto() {
    const modal = await this.modalController.create({
      component: ProductoModalComponent,
      componentProps: {
        producto: { nombre: '', descripcion: '', precio: 0, imagenUrl: '' },
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.productosService
          .createProducto(data.data)
          .then(() => {
            console.log('Producto agregado');
            this.obtenerProductos();
          })
          .catch((error) => console.error('Error al agregar producto:', error));
      }
    });

    return await modal.present();
  }

  async actualizarProducto(producto: Producto) {
    const modal = await this.modalController.create({
      component: ProductoModalComponent,
      componentProps: {
        producto: { ...producto },
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        const { id, ...dataToUpdate } = data.data;
        this.productosService
          .updateProducto(id, dataToUpdate)
          .then(() => {
            console.log('Producto actualizado');
            this.obtenerProductos();
          })
          .catch((error) => console.error('Error al actualizar producto:', error));
      }
    });

    return await modal.present();
  }

  eliminarProducto(id: string) {
    this.productosService
      .deleteProducto(id)
      .then(() => {
        console.log('Producto eliminado');
        this.obtenerProductos();
      })
      .catch((error) => console.error('Error al eliminar producto:', error));
  }

  onProfileButtonPressed() {
    this.router.navigate(['/profile']);
  }

  onCharactersPressed() {
    this.router.navigate(['/characters']);
  }

  async onSignOutButtonPressed() {
    this.cancelAlertService.showAlert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      async () => {
        this.logoutUseCase.performLogout();
        this.router.navigate(['/splash']);
      },
      () => {}
    );
  }
}
