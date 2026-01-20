import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa la instancia de almacenamiento
  async init() {
    // Si ya está listo, no hacemos nada
    if (this._storage != null) {
      return;
    }
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Guardar un valor (ej: set('tema', 'rosa'))
  public async set(key: string, value: any) {
    await this.init(); // Asegurar que esté inicializado
    return this._storage?.set(key, value);
  }

  // Obtener un valor (ej: get('tema'))
  public async get(key: string) {
    await this.init(); // Asegurar que esté inicializado
    return this._storage?.get(key);
  }

  // Eliminar un valor
  public async remove(key: string) {
    await this.init();
    return this._storage?.remove(key);
  }
}