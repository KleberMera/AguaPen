import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ListService {
  private environment = environment.aguapenApi;
  private authSrv = inject(AuthService);

  //injector
  private http = inject(HttpClient);

  constructor() {}

  //Listado de Productos
  getlistProducts() {
    const url = `${this.environment}allproducts`;
    const token = this.authSrv.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(url,  { headers });
  }

  //Listado de Usuarios-Trabajadores
  getListUsuarios(): Observable<any> {
    const url = `${this.environment}allusersworkers`;
    const token = this.authSrv.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(url,  { headers });
  
  }

  getReportsTrabajadores() {
    const url = `${this.environment}obtenerRegistrosConDetalles`;
    return this.http.get<any>(url);
  }

  getReportsAreas() {
    const url = `${this.environment}obtenerRegistrosConDetallesArea`;
    return this.http.get<any>(url);
  }

  getReportsVehiculos() {
    const url = `${this.environment}obtenerRegistrosConDetallesVehiculos`;
    return this.http.get<any>(url);
  }

  getListAreas() {
    const url = `${this.environment}allareas`;
    return this.http.get<any>(url);
  }

  getListVehiculos() {
    const url = `${this.environment}allvehiculos`;
    return this.http.get<any>(url);
  }


 
}
