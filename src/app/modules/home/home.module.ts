// src/app/modules/home/home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { ProductoModalComponent } from 'src/app/producto-modal/producto-modal.component'; // Asegúrate de importar el modal

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, ProductoModalComponent] // Declara el modal aquí
})
export class HomePageModule {}
