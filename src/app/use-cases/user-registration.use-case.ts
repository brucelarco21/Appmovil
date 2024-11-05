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

  async performRegistration(
    email: string,
    password: string,
    displayName: string, // Nuevo parámetro para el nombre
    fechaNacimiento: string // Nuevo parámetro para la fecha de nacimiento
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Registra al usuario en Firebase Authentication
      const userCredential = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Obtén el UID
        const uid = user.uid;

        // Crear objeto con los datos del usuario, incluyendo el nombre y la fecha de nacimiento
        const userData = {
          uid: uid,
          email: email,
          displayName: displayName,
          fechaNacimiento: fechaNacimiento, // Almacena la fecha de nacimiento
          photoURL: user.photoURL || '',  // Si no hay URL de imagen, guarda un string vacío
        };

        // Guarda la información del usuario en Realtime Database
        await this.db.object(`/users/${uid}`).set(userData);
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
