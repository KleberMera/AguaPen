import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountreportsService {

  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);

  listCountReports() {
    const url = `${this.environment}contador/search`;
    return this.http.post<any>(url , {});
  }

  updateCountReports(objtCount: any) {
    const url = `${this.environment}contador/mutate`;
    return this.http.post<any>(url , {
      mutate: [
        {
          operation: 'update',
          key: 1,
          attributes: {
            trabajadores_anulados : objtCount.trabajadores_anulados,
            areas_anuladas:objtCount.areas_anuladas,
            vehiculos_anulados: objtCount.vehiculos_anulados,
            trabajadores: objtCount.trabajadores, 
            areas: objtCount.areas,
            vehiculos: objtCount.vehiculos,
          },
        },
      ],
    });
  }
}
