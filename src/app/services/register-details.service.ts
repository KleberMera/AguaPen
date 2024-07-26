import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterDetailsService {

  constructor() { }

  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);
  private srvG = inject(GeneralService);

  // Ver registros
  getViewRegistros() {
    let url = 'viewRegistros';
    return this.http.get(this.environment + url);
  }

  // Registrar registro
  postRegisterRegistro(objRegistro: any) {
    let url = 'registerRegistro';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData({
        id_usuario: objRegistro.id_usuario,
        observacion: objRegistro.observacion,
      })
    );
  }

  // Registrar detalles del registro
  postRegisterRegistroDetalle(objDetalle: any): Observable<any> {
    let url = 'registerRegistroDetalle';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData({
        id_registro: objDetalle.id_registro,
        id_producto: objDetalle.id_producto,
        cantidad: objDetalle.cantidad,
      })
    );
  }

RegArea(objRegistro : any){
  let url = 'registrarRegistrode_Area';
  return this.http.post(
    this.environment + url,
    this.srvG.objectToFormData({
      id_area: objRegistro.id_area,
      observacion: objRegistro.observacion,
    })
  );
}

RegDetalleAreas(objDetalle : any){

  let url = 'RegDetalles_areas';
  return this.http.post(
    this.environment + url,
    this.srvG.objectToFormData({
      id_registro_a: objDetalle.id_registro_a,
      id_producto: objDetalle.id_producto,
      cantidad: objDetalle.cantidad,
    })
  );
}



  // Ver detalles de registro
  getViewRegistroDetalles() {
    let url = 'viewRegistroDetalles';
    return this.http.get(this.environment + url);
  }

}
