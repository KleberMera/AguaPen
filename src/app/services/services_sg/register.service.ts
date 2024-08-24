import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

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
            codigo_producto: objProduct.codigo_producto,
            nombre_producto: objProduct.nombre_producto,
            fecha_producto: objProduct.fecha_producto,
            hora_producto: objProduct.hora_producto,
            stock_producto: objProduct.stock_producto,
            estado_producto: objProduct.estado_producto,
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
            estado_producto: objProduct.estado_producto,
          },
        },
      ],
    });
  }

  // Registro de Trabajadores
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
            dt_status: objUser.dt_status,
          },
        },
      ],
    });
  }

  // Edición de Trabajadores
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
            dt_status: objUser.dt_status,
          },
        },
      ],
    });
  }

  // Registar Areas
  postRegisterAreas(objArea: any) {
    const url = `${this.environment}areas/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            nombre_area: objArea.nombre_area,
            estado: objArea.estado,
          },
        },
      ],
    });
  }

  // Editar Areas
  postEditAreas(objArea: any) {
    const url = `${this.environment}areas/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'update',
          key: objArea.id,
          attributes: {
            nombre_area: objArea.nombre_area,
            estado: objArea.estado,
          },
        },
      ],
    });
  }

  //Registrar Vehiculos
  postRegisterVehiculos(objVehiculo: any) {
    const url = `${this.environment}vehiculos/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            placa: objVehiculo.placa,
            tipo: objVehiculo.tipo,
            descripcion: objVehiculo.descripcion,
          },
        },
      ],
    });
  }

  //Editar Vehiculos
  postEditVehiculos(objVehiculo: any) {
    const url = `${this.environment}vehiculos/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'update',
          key: objVehiculo.id,
          attributes: {
            placa: objVehiculo.placa,
            tipo: objVehiculo.tipo,
            descripcion: objVehiculo.descripcion,
          },
        },
      ],
    });
  }
}
