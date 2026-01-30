import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(private storage: StorageService) { }

  async loginUser(credentials: any) {
    console.log('Intentando login con:', credentials);
    const registeredUser = await this.storage.get('user');
    console.log('Usuario registrado recuperado:', registeredUser);

    if (registeredUser &&
      credentials.email === registeredUser.email &&
      credentials.password === registeredUser.password) {
      console.log('Login exitoso');
      return Promise.resolve("Login correcto");
    } else {
      console.log('Login fallido: credenciales no coinciden');
      return Promise.reject("Login incorrecto");
    }
  }

  async registerUser(userData: any) {
    console.log('Registrando usuario:', userData);
    try {
      await this.storage.set('user', userData);
      console.log('Usuario guardado en storage');
      return Promise.resolve("Registro exitoso");
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      return Promise.reject("Error en el registro");
    }
  }
}
