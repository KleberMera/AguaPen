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
            this.setUser(response.usuario);
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
    return this.http.post<any>(url, {}, { headers });
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

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): any {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        // Verificar si el token no es null y no es una cadena incorrecta
        if (parsedToken !== null &&   parsedToken !== '[object][object]') {
          return parsedToken;
        }
      } catch (error) {
        // En caso de error al parsear, también removemos el token
        console.error('Error parsing token:', error);
      }
    }
    // Si el token es null, [object][object] o hay un error, eliminamos el token del localStorage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.logout();
    return null;
  }
  
  

  setToken(tokenKey: string) {
    localStorage.setItem(this.tokenKey, JSON.stringify(tokenKey));
  }

  clearAuthData() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem(this.tokenKey);
    this.logout();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
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
