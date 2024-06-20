import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private srvG: GeneralService,
    private httpClient: HttpClient
    
  ) { }


  login(username: string, password: string): boolean {
    // Aquí puedes añadir la lógica de autenticación real
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('user', 'admin');
      this.router.navigate(['principal']);
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }


  verUsuarios(){
    let url = 'verUsuarios';
    return this.httpClient.get(this.srvG.URLAPI + url);
  }


  registrarIngresos(ObjetoIngreso: any) {
    let url = 'registrarIngresos';
    return this.httpClient.post<any>(
      this.srvG.URLAPI + url,
      this.srvG.objectToFormData({
        fecha: ObjetoIngreso.fecha,
        monto: ObjetoIngreso.monto,
        descripcion: ObjetoIngreso.descripcion,
        usuario_id: ObjetoIngreso.usuario_id,
        estado: ObjetoIngreso.estado,
      })
    );
  }
}
