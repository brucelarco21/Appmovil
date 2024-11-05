import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { UserUpdateUseCase } from 'src/app/use-cases/user-update.use-case';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { UserLogoutUseCase } from 'src/app/use-cases/user-logout.user-case';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEmail: string = '';
  userName: string = '';
  userPhotoURL: string = 'assets/default-avatar.png';

  constructor(
    private storageService: StorageService,
    private userUpdateUseCase: UserUpdateUseCase,
    private alert: CancelAlertService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private logoutUseCase: UserLogoutUseCase
  ) {}

  async ngOnInit() {
    const user = await this.storageService.get('user');
    const userPhotoURL = await this.storageService.get('UserPhotoURL'); // Obtener la URL de la imagen

    if (user) {
      this.userEmail = user.email && user.email.trim() !== '' ? user.email : 'Correo no disponible';
      this.userName = user.displayName && user.displayName.trim() !== '' ? user.displayName : 'Nombre no disponible';
      this.userPhotoURL = userPhotoURL || 'assets/default-avatar.png'; // Usar la URL guardada o la predeterminada
    }
  }

  async onUpdateButtonPressed() {
    const result = await this.userUpdateUseCase.performUserUpdate(this.userName);

    if (result.success) {
      this.alert.showAlert(
        'Actualización Exitosa',
        'Tu perfil ha sido actualizado correctamente.',
        () => {}
      );
    } else {
      this.alert.showAlert(
        'Error',
        result.message,
        () => {}
      );
    }
  }

  async onProfileImagePressed() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Cámara',
          icon: 'camera',
          handler: async () => {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.DataUrl,
              source: CameraSource.Camera,
            });
            const imageUrl = image.dataUrl; // Obtener la URL de la imagen
            this.userPhotoURL = imageUrl; // Actualizar la imagen localmente
            await this.storageService.set('UserPhotoURL', this.userPhotoURL); // Guardar la URL en el almacenamiento local
            this.alert.showAlert(
              'Imagen Actualizada',
              'Tu imagen de perfil ha sido actualizada.',
              () => {}
            );
          }
        },
        {
          text: 'Imágenes',
          icon: 'image',
          handler: async () => {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.DataUrl,
              source: CameraSource.Photos,
            });
            const imageUrl = image.dataUrl; // Obtener la URL de la imagen
            this.userPhotoURL = imageUrl; // Actualizar la imagen localmente
            await this.storageService.set('UserPhotoURL', this.userPhotoURL); // Guardar la URL en el almacenamiento local
            this.alert.showAlert(
              'Imagen Actualizada',
              'Tu imagen de perfil ha sido actualizada.',
              () => {}
            );
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }
  
  async onSignOutButtonPressed() {
    this.alert.showAlert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      async () => {
        await this.logoutUseCase.performLogout();
        this.router.navigate(['/splash']);
      },
      () => {}
    );
  }
}
