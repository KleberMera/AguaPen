import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);
 

  constructor() {}

  // Registro de Productos
  postRegisterProducts(objProduct: any) {
    const url = `${this.environment}productos/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            nombre_producto: objProduct.nombre_producto,
            fecha_producto: objProduct.fecha_producto,
            hora_producto: objProduct.hora_producto,
            stock_producto: objProduct.stock_producto,
          },
        },
      ],
    });
  }

  // Edición de Productos
  postEditProducts(objProduct: any) {
    const url = `${this.environment}productos/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'update',
          key: objProduct.id,
          attributes: {
            nombre_producto: objProduct.nombre_producto,
            fecha_producto: objProduct.fecha_producto,
            hora_producto: objProduct.hora_producto,
            stock_producto: objProduct.stock_producto,
          },
        },
      ],
    });
  }

  requestdeleteProducts(id: number) {
    let url = `${this.environment}productos`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }

  postRegisterUsers(objUser: any) {
    const url = `${this.environment}usuariostrabajadores/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            tx_nombre: objUser.tx_nombre,
            tx_cedula: objUser.tx_cedula,
            tx_area: objUser.tx_area,
            tx_cargo: objUser.tx_cargo,
            tx_vehiculo: objUser.tx_vehiculo,
            tx_vehiculo_descripcion: objUser.tx_vehiculo_descripcion,
          },
        },
      ],
    });
  }

  postEditUsers(objUser: any) {
    const url = `${this.environment}usuariostrabajadores/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'update',
          key: objUser.id,
          attributes: {
            tx_nombre: objUser.tx_nombre,
            tx_cedula: objUser.tx_cedula,
            tx_area: objUser.tx_area,
            tx_cargo: objUser.tx_cargo,
            tx_vehiculo: objUser.tx_vehiculo,
            tx_vehiculo_descripcion: objUser.tx_vehiculo_descripcion,
          },
        },
      ],
    });
  }

  postRegisterUsersAdmin(objUser: any) {
   
    const url = `${this.environment}usuarios/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
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
}
