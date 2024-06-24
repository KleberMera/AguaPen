import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from './../../environments/environment.development';
import { GeneralService } from './general.service';
@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private environment = environment.aguapenApi;
  private srvG = inject(GeneralService);
  private http = inject(HttpClient);
  constructor() {}

  getProductos() {
    let url = 'verProductos';
    return this.http.get<any>(this.environment + url);
  }
}
