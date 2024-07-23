import { environment } from './../../environments/environment.development';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private environment = environment.aguapenApi;
  private loggedIn = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private srvG: GeneralService) {}

  login(objLogin: any) {
    let url = 'login';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData(objLogin)
    );
  }

  verDatosUsuario(objUsuario : any) {
    let url = 'viewDatosUsersSesion';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData(objUsuario)
    );
  }


updateUser(objUsuario: any) {
    let url = 'editarUsuario';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData(objUsuario)
    );
  }
  resetPassword(objUsuario: any) {
    let url = 'recuperarClave';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData(objUsuario)
    );
  }

  verifyCedula(cedula: string) {
    let url = 'verificarCedula';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData({ cedula })
    );
  }

  private nombresSubject = new BehaviorSubject<string | null>(
    this.getStoredNombres()
  );
  private usuarioIdSubject = new BehaviorSubject<string | null>(
    this.getStoredUsuarioId()
  );
  private apellidosSubject = new BehaviorSubject<string | null>(
    this.getStoredApellidos()
  );

  nombres$ = this.nombresSubject.asObservable();
  usuarioId$ = this.usuarioIdSubject.asObservable();
  apellidos$ = this.apellidosSubject.asObservable();

  private getStoredNombres(): string | null {
    return localStorage.getItem('nombres');
  }

  private getStoredUsuarioId(): string | null {
    return localStorage.getItem('usuario_id');
  }

  private getStoredApellidos(): string | null {
    return localStorage.getItem('apellidos');
  }

  setNombres(nombres: string) {
    this.nombresSubject.next(nombres);
    localStorage.setItem('nombres', nombres);
  }

  setUsuarioId(usuario_id: string) {
    this.usuarioIdSubject.next(usuario_id);
    localStorage.setItem('usuario_id', usuario_id);
  }

  setApellidos(apellidos: string) {
    this.apellidosSubject.next(apellidos);
    localStorage.setItem('apellidos', apellidos);
  }

  clearAuthData() {
    this.nombresSubject.next(null);
    this.usuarioIdSubject.next(null);
    this.apellidosSubject.next(null);
    localStorage.removeItem('nombres');
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('apellidos');
  }
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }
}
