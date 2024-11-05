import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from '../model/producto.model';

@Component({
  selector: 'app-producto-modal',
  templateUrl: './producto-modal.component.html',
  styleUrls: ['./producto-modal.component.scss'],
})
export class ProductoModalComponent {
  @Input() producto: Producto;
  imagenSeleccionada: string | null = null;

  constructor(private modalController: ModalController) {}

  confirmar() {
    if (typeof this.imagenSeleccionada === 'string') {
      this.producto.imagenUrl = this.imagenSeleccionada;
    }
    this.modalController.dismiss(this.producto);
  }

  cerrar() {
    this.modalController.dismiss();
  }

  manejarArchivo(event: Event) {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = () => {
        if (typeof lector.result === 'string') {
          this.imagenSeleccionada = lector.result;
        }
      };
      lector.readAsDataURL(archivo);
    }
  }
}
