import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  private environment = environment.aguapenApi;
  private http = inject(HttpClient);

  // Eliminacion de Productos
  requestdeleteProducts(id: number) {
    let url = `${this.environment}productos`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }

  // Eliminacion de Productos
  requestdeleteTrabajadores(id: number) {
    let url = `${this.environment}usuariostrabajadores`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }

  // Eliminar Areas
  requestdeleteAreas(id: number) {
    let url = `${this.environment}areas`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }

  //Eliminar Vehiculos
  requestdeleteVehiculos(id: number) {
    let url = `${this.environment}vehiculos`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }

  //Eliminar Vehiculos
  requestdeletedetalle(id: number) {
    let url = `${this.environment}registrosdetalle`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }

  requestdeletedetalleareas(id: number) {
    let url = `${this.environment}registrodetalleareas`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }

  //Eliminar Vehiculos
  requestdeletedetallevehiculos(id: number) {
    let url = `${this.environment}registrodetallevehiculos`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }
}
