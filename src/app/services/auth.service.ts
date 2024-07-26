import { environment } from './../../environments/environment.development';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private environment = environment.aguapenApi;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private srvG: GeneralService) {}

  login(objLogin: any): Observable<any> {
    const url = `${this.environment}login`;
    return this.http
      .post(url, {
        usuario: objLogin.usuario,
        password: objLogin.clave,
      })
      .pipe(
        tap((response: any) => {
          if (response && response.usuario) {
            this.setUsuarioId(response.usuario.id.toString());
            this.setNombres(response.usuario.nombres);
            this.setApellidos(response.usuario.apellidos);
            this.setLoggedIn(true);
          }
        })
      );
  }

  verDatosUsuario(usuarioId: string): Observable<any> {
    const url = `${this.environment}usuarios/${usuarioId}`;
    return this.http.get(url);
  }

  updateUser(objUser: any) {
    const url = `${this.environment}usuarios/mutate`;
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
            clave: objUser.clave,
            rol_id: objUser.rol_id,
          },
        },
      ],
    });
  }
  

  verifyCedula(cedula: string) {
    const url = `${this.environment}verifycedula`;
    return this.http.post(url, { cedula });
  }
  
  resetPasswordByCedula(cedula: string, newPassword: string, newPasswordConfirmation: string) {
    const url = `${this.environment}resetpassword`;
    return this.http.post(url, {
      cedula: cedula,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
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
    this.setLoggedIn(false);
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }
}


