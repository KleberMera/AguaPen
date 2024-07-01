import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);
  private srvG = inject(GeneralService);

  constructor() {}

  //Registro de Productos
  postRegisterProducts(objProduct: any) {
    let url = 'registerProducts';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData({
        nombre_producto: objProduct.nombre_producto,
        fecha_producto: objProduct.fecha_producto,
        hora_producto: objProduct.hora_producto,
        stock_producto: objProduct.stock_producto,
      })
    );
  }

  postEditProducts(objProduct: any) {
    let url = 'editProducts';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData({
        id: objProduct.id,
        nombre_producto: objProduct.nombre_producto,
        fecha_producto: objProduct.fecha_producto,
        hora_producto: objProduct.hora_producto,
        stock_producto: objProduct.stock_producto,
      })
    );
  }

  postDeleteProducts(id: number) {
    let url = 'deleteProducts';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData({
        id: id,
      })
    );
  }
}
