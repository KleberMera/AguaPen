import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Auth, lsUser } from '../../models/auth.model';
import {
  PayloadUserCreate,
  PayloadUserUpdate,
  viewDataUser,
} from '../../models/users.model';
import { error } from 'pdf-lib';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private environment = environment.aguapenApi;
  private tokenKey = 'auth_token';
  private readonly http = inject(HttpClient);

  login(objLogin: Auth) {
    const url = `${this.environment}login`;
    return this.http.post<Auth>(url, objLogin);
  }

  listUsers(): Observable<any> {
    const url = `${this.environment}allusers`;
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(url, { headers });
  }

  // Registro de Usuarios Admin
  createUser(objUser: PayloadUserCreate) {
    const url = `${this.environment}users/mutate`;
    return this.http.post<PayloadUserCreate>(url, objUser);
  }

  updateUser(objUser: PayloadUserUpdate) {
    const url = `${this.environment}users/mutate`;
    return this.http.post<PayloadUserUpdate>(url, objUser);
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

  getLoginUser(): Observable<viewDataUser> {
    const url = `${this.environment}user`;
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<viewDataUser>(url, { headers });
  }

  public getStoredUser(): lsUser {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setUser(user: lsUser, token: string) {
    user.token = token; // Añadir el token al objeto de usuario
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): any {
    const token = localStorage.getItem(this.tokenKey);
    if (token && token !== '[object][object]') {
      const parsedToken = JSON.parse(token);
      return parsedToken;
    }

    return this.clearAuthData();
  }

  setToken(tokenKey: string) {
    localStorage.setItem(this.tokenKey, JSON.stringify(tokenKey));
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  clearAuthData() {
    localStorage.removeItem('user');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userPermissions');
  }

  logout(): Observable<any> {
    const url = `${this.environment}logout`;
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(url, {}, { headers }).pipe(
      tap((res) => {
        this.clearAuthData();
        console.log('Datos eliminados');
      })
    );
  }

  /*tokenuser() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      const token = parsedUser.token;
      return token;
    }
  }*/

  /*  resetPasswordByCedula(
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
  }*/

  /*verifyCedula(cedula: string) {
    const url = `${this.environment}verifycedula`;
    return this.http.post(url, { cedula });
  }*/
}
