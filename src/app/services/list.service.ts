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

  getListProductos() {
    let url = 'verProductos';
    return this.http.get<any>(this.environment + url);
  }
}
