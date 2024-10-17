import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService'; // Asegúrate de tener el servicio de alertas
import { UserLoginUseCase } from 'src/app/use-cases/user-login.use-case';

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
    private alert: CancelAlertService // Inyecta el servicio de alertas
  ) {}

  ngOnInit() {}

  async onLoginButtonPressed() {
    const result = await this.userLoginUseCase.performLogin(this.email, this.password);

    if (result.success) {
      this.alert.showAlert(
        'Login exitoso',
        'Has iniciado sesión correctamente.',
        () => {
          this.router.navigate(['/splash']); // Navegar a 'splash' cuando el usuario presiona "Aceptar"
        }
      );
    } else {
      this.alert.showAlert(
        'Error',
        result.message,
        () => {
          // Se puede agregar alguna lógica aquí si es necesario
        }
      );
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}

