import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { SessionManager } from 'src/managers/SessionManager';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private sessionManage: SessionManager,
    private router: Router,
    private alert: CancelAlertService
  ) {}

  confirmRegister() {
    this.alert.showAlert(
      'Confirmación de Registro',
      '¿Estás seguro de que deseas registrarte?',
      () => this.onRegister(), // Acción al confirmar
      () => console.log('Registro cancelado') // Acción al cancelar
    );
  }

  async onRegister() {
    try {
      const userCredential = await this.sessionManage.registerUserWith(
        this.email,
        this.password
      );
      console.log('Registro exitoso:', userCredential);
      this.router.navigate(['/login']); // Redirige a la página de login tras el registro
    } catch (error) {
      console.error('Error en el registro:', error);
      this.alert.showAlert(
        'Error en el registro', 
        'No se pudo completar el registro. Inténtalo nuevamente.', 
        () => {} // Acción vacía o puedes definir alguna otra acción
      );
    }
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
