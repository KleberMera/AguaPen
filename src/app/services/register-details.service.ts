import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterDetailsService {
  constructor() {}

  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);


  // Registrar registro
  postRegisterRegistro(objRegistro: any) {
    const url = `${this.environment}registros/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            
            id_usuario: objRegistro.id_usuario,
            fecha_registro: objRegistro.fecha_registro,
            hora_registro: objRegistro.hora_registro,
            observacion: objRegistro.observacion,
          },
        },
      ],
    });
  }

  // Registrar detalles del registro
  postRegisterRegistroDetalle(objDetalle: any) {
    const url = `${this.environment}registrosdetalle/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            id_registro: objDetalle.id_registro,
            id_producto: objDetalle.id_producto,
            cantidad: objDetalle.cantidad,
          },
        },
      ],
    });
  }

postRegisterArea(objRegistro : any){
  const url = `${this.environment}registroareas/mutate`;
  return this.http.post(url, {
    mutate: [
      {
        operation: 'create',
        attributes: {
          id_area: objRegistro.id_area,
          fecha_registro: objRegistro.fecha_registro,
          hora_registro: objRegistro.hora_registro,
          observacion: objRegistro.observacion,
        },
      },
    ],
  });
}

//RegisterVehiculos
postRegisterVehiculos(objRegistro : any){
  const url = `${this.environment}registrovehiculos/mutate`;
  return this.http.post(url, {
    mutate: [
      {
        operation: 'create',
        attributes: {
          id_vehiculo: objRegistro.id_vehiculo,
          fecha_registro: objRegistro.fecha_registro,
          hora_registro: objRegistro.hora_registro,
          observacion: objRegistro.observacion,
        },
      },
    ],
  });
}

//RegisterDetalleVehiculos
postRegisterDetalleVehiculos(objRegistro : any){
  const url = `${this.environment}registrodetallevehiculos/mutate`;
  return this.http.post(url, {
    mutate: [
      {
        operation: 'create',
        attributes: {
          id_registro_vehiculo: objRegistro.id_registro_vehiculo,
          id_producto: objRegistro.id_producto,
          cantidad: objRegistro.cantidad,
        },
      },
    ],
  });
}



postRegisterDetalleAreas(objDetalle : any){
  const url = `${this.environment}registrodetalleareas/mutate`;
  return this.http.post(url, {
    mutate: [
      {
        operation: 'create',
        attributes: {
          id_registro_area: objDetalle.id_registro_area,
          id_producto: objDetalle.id_producto,
          cantidad: objDetalle.cantidad,
        },
      },
    ],
  });


  
}



  // Ver detalles de registro
  getViewRegistroDetalles() {
    let url = 'viewRegistroDetalles';
    return this.http.get(this.environment + url);
  }

  //Ver el ultimo registro registro
  getidlasregistro() {
    const url = `${this.environment}idlastregistro`;
    return this.http.get(url);
  }

  getidlastregistroarea() {
    const url = `${this.environment}idlastregistroarea`;
    return this.http.get(url);
  }

  getidlastregistrovehiculos() {
    const url = `${this.environment}idlastregistrovehiculos`;
    return this.http.get(url);
  }

  postEditProductos(objProduct: any) {
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

  
}
