import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/managers/StorageService';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router, private storageService: StorageService) { }

  ngOnInit() {
    this.showSplash();
  }

  async showSplash() {
    // Mantener el splash screen visible por 3 segundos
    setTimeout(async () => {
      await this.checkSession();
    }, 2000); // 3000 ms = 3 segundos
  }

  async checkSession() {
    const user = await this.storageService.get('user');
    if (user) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
