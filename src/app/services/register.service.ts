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



  postRegisterUsers(objUser: any) {
    let url = 'newUsuarioTrabajador';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData({
        tx_nombre: objUser.tx_nombre,
        tx_cedula: objUser.tx_cedula,
        tx_area: objUser.tx_area,
        tx_cargo: objUser.tx_cargo,
        tx_vehiculo: objUser.tx_vehiculo,
        tx_vehiculo_descripcion: objUser.tx_vehiculo_descripcion,
      })
    );
}

postEditUsers(objUser: any) {
  let url = 'editUsuarioTrabajador';
  return this.http.post(
    this.environment + url,
    this.srvG.objectToFormData({
      id_usuario: objUser.id_usuario,
      tx_nombre: objUser.tx_nombre,
      tx_cedula: objUser.tx_cedula,
      tx_area: objUser.tx_area,
      tx_cargo: objUser.tx_cargo,
      tx_vehiculo: objUser.tx_vehiculo,
      tx_vehiculo_descripcion: objUser.tx_vehiculo_descripcion,
    })
  );
}
}
