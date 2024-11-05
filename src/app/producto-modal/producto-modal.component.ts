import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from '../model/producto.model'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-producto-modal',
  templateUrl: './producto-modal.component.html',
  styleUrls: ['./producto-modal.component.scss'],
})
export class ProductoModalComponent {
  @Input() producto: Producto; // Recibe el producto a editar o un nuevo objeto
  imagenSeleccionada: string | null = null; // Para almacenar la imagen seleccionada como string

  constructor(private modalController: ModalController) {}

  confirmar() {
    // Asigna la imagen seleccionada a la propiedad del producto solo si es un string
    if (typeof this.imagenSeleccionada === 'string') {
      this.producto.imagenUrl = this.imagenSeleccionada;
    }
    this.modalController.dismiss(this.producto); // Envía el producto actualizado
  }

  cerrar() {
    this.modalController.dismiss();
  }

  // Método para manejar la selección de archivos
  manejarArchivo(event: Event) {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = () => {
        if (typeof lector.result === 'string') {
          this.imagenSeleccionada = lector.result; // Almacena la imagen en el componente como string
        }
      };
      lector.readAsDataURL(archivo); // Lee la imagen como URL de datos
    }
  }
}
