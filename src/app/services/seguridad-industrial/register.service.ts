import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { PayloadProductCreate, PayloadProductUpdate } from '../../models/products.model';
import { PayloadVehiculoCreate, PayloadVehiculoUpdate } from '../../models/vehicles.model';
import { PayloadAreaCreate, PayloadAreaUpdate } from '../../models/areas.model';
import { PayloadWorkerCreate, PayloadWorkerUpdate } from '../../models/workers.model';

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

   // Registar Areas
   postRegisterAreas(objArea: PayloadAreaCreate) {
    const url = `${this.environment}areas/mutate`;
    return this.http.post<PayloadAreaCreate>(url, objArea);
  }

  // Editar Areas
  postEditAreas(objArea: PayloadAreaUpdate) {
    const url = `${this.environment}areas/mutate`;
    return this.http.post<PayloadAreaUpdate>(url, objArea);
  }

  // Registro de Trabajadores
  postRegisterUsers(objUser: PayloadWorkerCreate) {
    const url = `${this.environment}usuariostrabajadores/mutate`;
    return this.http.post<PayloadWorkerCreate>(url, objUser );
  }

  // Edición de Trabajadores
  postEditUsers(objUser: PayloadWorkerUpdate) {
    const url = `${this.environment}usuariostrabajadores/mutate`;
    return this.http.post<PayloadWorkerUpdate>(url,objUser );
  }


}
