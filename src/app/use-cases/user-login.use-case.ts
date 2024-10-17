import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from 'src/managers/StorageService';

@Injectable({
  providedIn: 'root',
})
export class UserLoginUseCase {

  constructor(
    private fireAuth: AngularFireAuth,
    private storageService: StorageService
  ) {}

  async performLogin(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const userCredential = await this.fireAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        await this.storageService.set('user', userData);

        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: "User not found" };
      }
    } catch (error: any) {
      let errorMessage = 'Error during login';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'User not found. Please check your credentials.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format.';
          break;
        default:
          errorMessage += ': ' + error.message;
          break;
      }

      return { success: false, message: errorMessage };
    }
  }
}
