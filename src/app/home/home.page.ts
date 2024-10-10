import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ProductosService } from '../services/productos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchQuery: string = '';
  scannedCode: string | null = null; // Asegúrate de inicializar esta propiedad
  productos: any[] = []; // Cambia el tipo según tus necesidades
  ingredients: string[] = []; // Asegúrate de tener esta propiedad
  selectedIngredients: string[] = []; // Para manejar ingredientes seleccionados
  categoriaId: number = 0; // Variable para el ID de la categoría

  constructor(private navCtrl: NavController, private productosService: ProductosService) {}

  // Método para buscar productos
  buscarProductos() {
    this.productosService.buscarProductos(this.searchQuery).subscribe((data: any) => {
      this.productos = data; // Asegúrate de que esto se adapte a tu respuesta del servicio
    }, error => {
      console.error('Error al buscar productos', error);
    });
  }

  // Método para listar productos por categoría
  listarPorCategoria() {
    this.productosService.listarProductosPorCategoria(this.categoriaId).subscribe((data: any) => {
      this.productos = data; // Asegúrate de que esto se adapte a tu respuesta del servicio
    }, error => {
      console.error('Error al listar productos por categoría', error);
    });
  }

  // Método para crear un producto
  crearProducto() {
    const nuevoProducto = {
      nombre: 'Nuevo Producto', // Aquí podrías cambiarlo por una entrada del usuario
      categoriaId: this.categoriaId,
      precio: 1000, // Aquí podrías cambiarlo por una entrada del usuario
      // Otros campos necesarios según tu API
    };

    this.productosService.crearProducto(nuevoProducto).subscribe((response) => {
      console.log('Producto creado con éxito:', response);
      this.listarPorCategoria(); // Recargar productos de la categoría
    }, error => {
      console.error('Error al crear el producto:', error);
    });
  }

  // Método para eliminar un producto
  eliminarProducto(productoId: number) {
    this.productosService.eliminarProducto(productoId).subscribe((response) => {
      console.log('Producto eliminado con éxito:', response);
      this.listarPorCategoria(); // Actualizar la lista de productos
    }, error => {
      console.error('Error al eliminar el producto:', error);
    });
  }

  // Método para ir a la sección "Para Ti"
  goToParaTi() {
    this.navCtrl.navigateForward('/para-ti');
  }

  // Método para ir a la comunidad
  goToComunidad() {
    this.navCtrl.navigateForward('/comunidad');
  }

  // Método para ir a las guardadas
  goToGuardada() {
    this.navCtrl.navigateForward('/guardadas');
  }

  // Método para ir a las notificaciones
  goToNotifications() {
    this.navCtrl.navigateForward('/notificaciones');
  }

  // Método para abrir el menú del usuario
  presentUserMenu(event: Event) {
    // Implementa la lógica para abrir el menú
  }

  // Método para alternar ingredientes seleccionados
  toggleIngredient(ingredient: string) {
    const index = this.selectedIngredients.indexOf(ingredient);
    if (index > -1) {
      this.selectedIngredients.splice(index, 1); // Elimina el ingrediente si ya está seleccionado
    } else {
      this.selectedIngredients.push(ingredient); // Agrega el ingrediente a los seleccionados
    }
    // Aquí puedes actualizar los productos según los ingredientes seleccionados
  }

  // Método para cerrar sesión
  logout() {
    // Aquí puedes agregar la lógica para cerrar sesión, como limpiar el token, etc.
    this.navCtrl.navigateRoot('/login'); // Cambia '/login' a la ruta de tu página de inicio de sesión
  }

  // Método para ir a la página de inicio
  goToInicio() {
    this.navCtrl.navigateForward('/inicio');
  }

  // Método para ir a la página de explorar
  goToExplorar() {
    this.navCtrl.navigateForward('/explorar');
  }

  // Método para escanear código de barras
  scanBarcode() {
    // Asegúrate de actualizar this.scannedCode con el resultado
  }

  // Método para ir al planificador
  goToPlanificador() {
    this.navCtrl.navigateForward('/planificador');
  }

  // Método para ir a la página de listas
  goToListas() {
    this.navCtrl.navigateForward('/listas');
  }
}
