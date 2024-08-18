import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);


  //Listado de Permisos
  getListPermisos() {
    const url = `${this.environment}permisosmenus`;
    return this.http.get<any>(url);
  }


  //Listado de Permisos por id de Usuario
  getListPermisosPorUsuario(userId: number) {
    const url = `${this.environment}permisosmenus/${userId}`;
    return this.http.get<any>(url);
  }
}
