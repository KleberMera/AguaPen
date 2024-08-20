import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CountdataService {

  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);

  countUsers() {
    const url = `${this.environment}countusersworkers`;
    return this.http.get<any>(url);
  }

  countProducts() {
    const url = `${this.environment}countproducts`;
    return this.http.get<any>(url);
  }

  countAreas() {
    const url = `${this.environment}countareas`;
    return this.http.get<any>(url);
  }


}
