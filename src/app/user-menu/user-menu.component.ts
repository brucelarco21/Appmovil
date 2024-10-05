import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/managers/StorageService';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  @Output() signOut = new EventEmitter<void>(); // Emitir evento para cerrar sesión

  constructor(private router: Router, private storageService: StorageService) {}

  onSignOut() {
    this.storageService.clear(); // Limpia los datos de sesión
    this.router.navigate(['/login']); // Navega a la página de login
    this.signOut.emit(); // Emitir evento para que el padre pueda manejar la lógica si es necesario
  }
}
