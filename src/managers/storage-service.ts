import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  constructor(private storage: AngularFireStorage) {}

  async uploadFile(filePath: string, storagePath: string, fileName: string): Promise<string> {
    try {
      const storageRef = this.storage.ref(`${storagePath}/${fileName}`); // Concatenar el path de almacenamiento con el nombre del archivo

      // Subimos el archivo en formato base64
      const uploadTask = await storageRef.putString(filePath, 'data_url'); // Usando 'data_url' para base64

      // Esperamos a que la tarea de subida termine y luego obtenemos la URL de descarga
      const downloadURL = await firstValueFrom(storageRef.getDownloadURL());

      return downloadURL;
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      throw error;
    }
  }
}
