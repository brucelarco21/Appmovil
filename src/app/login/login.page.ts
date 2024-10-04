import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManager } from 'src/managers/SessionManager';
import { StorageService } from 'src/managers/StorageService';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router, 
    private sessionManager: SessionManager,
    private storageService: StorageService
  ) { }

    email: string = '';
    user: string = '';
    password: string = '';

  ngOnInit() { }

  async onLoginButtonPressed() {
    if (this.sessionManager.performLogin(this.user, this.password)) {
      await this.storageService.set('userEmail', this.email)
      await this.storageService.set('isSessionActive', true)
      this.router.navigate(['/home'], { queryParams: { email: this.email } });
    } else {
      this.user = '';
      this.password = '';
      alert('Las credenciales ingresadas son inválidas.');
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }

}
