import { environment } from './../../environments/environment.development';
import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private environment = environment.aguapenApi;
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  private tokenKey = 'auth_token';
  user$ = this.userSubject.asObservable();

  private http = inject(HttpClient);

  login(objLogin: any): Observable<any> {
    const url = `${this.environment}login`;
    return this.http
      .post(url, {
        usuario: objLogin.usuario,
        password: objLogin.password,
      })
      .pipe(
        tap((response: any) => {
          if (response && response.usuario) {
            this.setUser(response.usuario, response.token); // Pasar el token
            this.setToken(response.token);
          }
        })
      );
  }

  viewDataUser(usuarioId: string): Observable<any> {
    const url = `${this.environment}users/${usuarioId}`;
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(url, { headers });
  }

  updateUser(objUser: any) {
    const url = `${this.environment}users/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'update',
          key: objUser.id,
          attributes: {
            cedula: objUser.cedula,
            telefono: objUser.telefono,
            nombres: objUser.nombres,
            apellidos: objUser.apellidos,
            correo: objUser.correo,
            usuario: objUser.usuario,
            password: objUser.password,
            rol_id: objUser.rol_id,
          },
        },
      ],
    });
  }

  // Registro de Usuarios Admin
  createUser(objUser: any) {
    const url = `${this.environment}users/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            cedula: objUser.cedula,
            telefono: objUser.telefono,
            nombres: objUser.nombres,
            apellidos: objUser.apellidos,
            correo: objUser.correo,
            usuario: objUser.usuario,
            password: objUser.password,
            rol_id: objUser.rol_id,
          },
        },
      ],
    });
  }

  //Delete Users
  deleteUser(id: number) {
    const url = `${this.environment}users`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }

  listUsers(): Observable<any> {
    const url = `${this.environment}allusers`;
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(url,  { headers });
  }

  verifyCedula(cedula: string) {
    const url = `${this.environment}verifycedula`;
    return this.http.post(url, { cedula });
  }

  resetPasswordByCedula(
    cedula: string,
    newPassword: string,
    newPasswordConfirmation: string
  ) {
    const url = `${this.environment}resetpassword`;
    return this.http.post(url, {
      cedula: cedula,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
  }

  private getStoredUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setUser(user: any, token: string) {
    user.token = token; // Añadir el token al objeto de usuario
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): any {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        const storedUser = this.getStoredUser();

        // Verificar si el token es válido y corresponde al usuario almacenado
        if (
          parsedToken &&
          storedUser &&
          storedUser.token === parsedToken &&
          parsedToken !== '[object][object]'
        ) {
          return parsedToken;
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }

    // Si el token es inválido, eliminar todo del localStorage y cerrar sesión
    this.clearAuthData();
    return null;
  }

  setToken(tokenKey: string) {
    localStorage.setItem(this.tokenKey, JSON.stringify(tokenKey));
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  clearAuthData() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem(this.tokenKey);
  }

  logout(): Observable<any> {
    const url = `${this.environment}logout`;
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(url, {}, { headers }).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }
}
