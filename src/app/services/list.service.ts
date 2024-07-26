import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  private environment = environment.aguapenApi;

  //injector
  private http= inject(HttpClient);
  private srvG = inject(GeneralService);

  constructor() { }

  //Listado de Productos
  getListProductos() {
    let url = 'viewProducts';
    return this.http.get<any>(this.environment + url);
  }

  //Listado de Usuarios-Trabajadores
  getListUsuarios() {
    let url = 'viewUsuariosTrabajadores';
    return this.http.get<any>(this.environment + url);
  }


  getviewRegistroAll() {
    let url = 'viewRegistroAll';
    return this.http.get<any>(this.environment + url);
  }

  getviewAreas(){
    let url = 'viewAreas';
    return this.http.get<any>(this.environment + url);
  }

  viewReportesDeAREAS(){
    let url = 'viewRegxAreas';
    return this.http.get<any>(this.environment + url);
  }
}
