import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = 'https://music.fly.dev';

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  async loginUser(credentials: { email: string; password: string }) {
    console.log('Intentando login con API:', credentials);

    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.baseUrl}/login`, {
          user: {
            email: credentials.email,
            password: credentials.password
          }
        })
      );

      console.log('Respuesta del servidor:', response);

      if (response.status === 'OK' && response.user) {
        // Guardar usuario en storage
        await this.storage.set('user', response.user);
        await this.storage.set('login', true);
        console.log('Login exitoso, usuario guardado:', response.user);
        return Promise.resolve(response.msg || "Login correcto");
      } else {
        console.log('Login fallido: respuesta inválida');
        return Promise.reject("Respuesta del servidor inválida");
      }
    } catch (error: any) {
      console.error('Error en login:', error);

      // Manejar errores específicos del servidor
      if (error.error && error.error.msg) {
        return Promise.reject(error.error.msg);
      } else if (error.status === 401) {
        return Promise.reject("Credenciales incorrectas");
      } else if (error.status === 0) {
        return Promise.reject("No se pudo conectar con el servidor");
      } else {
        return Promise.reject("Error al iniciar sesión");
      }
    }
  }

  async registerUser(userData: {
    email: string;
    password: string;
    password_confirmation: string;
    name: string;
    last_name: string;
  }) {
    console.log('Registrando usuario en API:', userData);

    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.baseUrl}/signup`, {
          user: {
            email: userData.email,
            password: userData.password,
            password_confirmation: userData.password_confirmation,
            name: userData.name,
            last_name: userData.last_name
          }
        })
      );

      console.log('Respuesta del servidor:', response);

      if (response.status === 'OK') {
        console.log('Registro exitoso');
        return Promise.resolve(response.msg || "Registro exitoso");
      } else {
        console.log('Registro fallido: respuesta inválida');
        return Promise.reject("Respuesta del servidor inválida");
      }
    } catch (error: any) {
      console.error('Error en registro:', error);

      // Manejar errores específicos del servidor
      if (error.error && error.error.msg) {
        return Promise.reject(error.error.msg);
      } else if (error.error && error.error.errors) {
        // Manejar errores de validación
        const errors = error.error.errors;
        const errorMessages = Object.keys(errors).map(key => `${key}: ${errors[key].join(', ')}`);
        return Promise.reject(errorMessages.join('; '));
      } else if (error.status === 0) {
        return Promise.reject("No se pudo conectar con el servidor");
      } else {
        return Promise.reject("Error al registrar usuario");
      }
    }
  }

  async logout() {
    await this.storage.remove('user');
    await this.storage.remove('login');
    console.log('Sesión cerrada');
  }

  async getCurrentUser() {
    return await this.storage.get('user');
  }

  async isLoggedIn(): Promise<boolean> {
    const isLogged = await this.storage.get('login');
    return !!isLogged;
  }
}
