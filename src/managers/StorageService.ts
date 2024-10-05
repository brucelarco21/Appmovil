import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular"; // Asegúrate de importar desde ionic-storage-angular

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private _storage: Storage | null = null;

    constructor(private storage: Storage) {
        this.init();
    }

    async init() {
        const storage = await this.storage.create();
        this._storage = storage;
    }

    public async set(key: string, value: any): Promise<any> {
        if (!this._storage) {
            await this.init();
        }
        return this._storage?.set(key, value);
    }

    public async get(key: string): Promise<any> {
        if (!this._storage) {
            await this.init();
        }
        return this._storage?.get(key);
    }

    public async remove(key: string): Promise<any> {
        if (!this._storage) {
            await this.init();
        }
        return this._storage?.remove(key);
    }

    public async clear(): Promise<void> {
        if (!this._storage) {
            await this.init();
        }
        return this._storage?.clear();
    }

    // Nuevos métodos para manejar el usuario
    public async setUser(email: string, password: string): Promise<void> {
        await this.set('userEmail', email);
        await this.set('userPassword', password);
    }

    public async getUser(): Promise<{ email: string | null, password: string | null }> {
        const email = await this.get('userEmail');
        const password = await this.get('userPassword');
        return { email, password };
    }
}
