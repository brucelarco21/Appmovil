import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { UserLoginUseCase } from 'src/app/use-cases/user-login.use-case';
import { StorageService } from 'src/managers/StorageService'; // Asegúrate de tener este servicio

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private userLoginUseCase: UserLoginUseCase,
    private alert: CancelAlertService,
    private storageService: StorageService // Inyecta el servicio de almacenamiento
  ) {}

  async ngOnInit() {
    // Recuperar el correo guardado y asignarlo al campo de email
    this.email = await this.storageService.get('userEmail') || '';
  }

  async onLoginButtonPressed() {
    const result = await this.userLoginUseCase.performLogin(this.email, this.password);

    if (result.success) {
      // Guarda el correo en el almacenamiento
      await this.storageService.set('userEmail', this.email);
      
      this.alert.showAlert(
        'Login exitoso',
        'Has iniciado sesión correctamente.',
        () => {
          this.router.navigate(['/home']); // Cambia a la ruta correcta
        }
      );
    } else {
      this.alert.showAlert(
        'Error',
        result.message,
        () => {
          // Lógica adicional si es necesario
        }
      );
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}
