import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterDetailsService {

  constructor() { }

  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);
  private srvG = inject(GeneralService);

  
   // Registrar Registro con Detalles
   postRegisterRegistro(registro: any, detalles: any[]) {
    let url = 'registerRegistro';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData({
        id_usuario: registro.id_usuario,
        fecha_registro: registro.fecha_registro,
        hora_registro: registro.hora_registro,
        observacion: registro.observacion,
        detalles: JSON.stringify(detalles)  // Convertir detalles a JSON string
      })
    );
  }
}
