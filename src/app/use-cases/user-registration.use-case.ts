import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationUseCase {

  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}

  async performRegistration(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      // Registra al usuario en Firebase Authentication
      const userCredential = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Obtén el UID y guarda el UID y el correo en Realtime Database
        const uid = user.uid;
        await this.db.object(`/users/${uid}`).set({
          email: email
        });
      }

      // Devuelve true si fue exitoso, con un mensaje
      return { success: true, message: "Usuario registrado con éxito" };

    } catch (error: any) {
      // Manejo de errores basado en el código de Firebase
      let errorMessage = 'Ocurrió un error al registrar el usuario';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está en uso. Por favor, utiliza otro o inicia sesión.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'La dirección de correo electrónico no es válida.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil.';
          break;
        default:
          errorMessage += ': ' + error.message;
          break;
      }

      // Devuelve false si hubo un error, junto con el mensaje de error
      return { success: false, message: errorMessage };
    }
  }
}
