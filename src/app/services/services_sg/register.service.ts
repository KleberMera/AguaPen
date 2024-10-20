import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { PayloadProductCreate, PayloadProductUpdate } from '../../models/products.interfaces';
import { PayloadVehiculoCreate, PayloadVehiculoUpdate } from '../../models/vehicles.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private environment = environment.aguapenApi;
  private http = inject(HttpClient);

  // Registro de Productos
  postRegisterProducts(objProduct: PayloadProductCreate) {
    const url = `${this.environment}productos/mutate`;
    return this.http.post<PayloadProductCreate>(url,  objProduct);
  }

  // Edición de Productos
  postEditProducts(objProduct: PayloadProductUpdate) {
    const url = `${this.environment}productos/mutate`;
    return this.http.post<PayloadProductUpdate>(url, objProduct);
  }

  //Registrar Vehiculos
  postRegisterVehiculos(objVehiculo: PayloadVehiculoCreate) {
    const url = `${this.environment}vehiculos/mutate`;
    return this.http.post<PayloadVehiculoCreate>(url, objVehiculo);
  }

  //Editar Vehiculos
  postEditVehiculos(objVehiculo: PayloadVehiculoUpdate) {
    const url = `${this.environment}vehiculos/mutate`;
    return this.http.post<PayloadVehiculoUpdate>(url, objVehiculo);
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
            tx_correo: objUser.tx_correo,
            dt_status: objUser.dt_status,
            dt_usuario: objUser.dt_usuario,
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
            tx_correo: objUser.tx_correo,
            dt_status: objUser.dt_status,
            dt_usuario: objUser.dt_usuario,
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

  
}
