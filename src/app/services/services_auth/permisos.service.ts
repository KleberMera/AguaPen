import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);


  //Listado de Permisos
  getListPermisos() {
    const url = `${this.environment}permisosmenus`;
    return this.http.get<any>(url);
  }


  getListPermisosPorUsuario(userId: number) {
    const url = `${this.environment}permisosmenus/${userId}`;
    return this.http.get<any>(url).pipe(
      tap((res: any) => {
        localStorage.setItem('userPermissions', JSON.stringify(res.data));
      })
    );
  }


  getListModulos() {
    const url = `${this.environment}allmodulos`;
    return this.http.get<any>(url);
  }


  postEditPermisos(objPermiso: any) {
    const url = `${this.environment}permisos/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'update',
          key: objPermiso.id,
          attributes: {
            user_id: objPermiso.user_id,
            opcion_id: objPermiso.opcion_id,
            per_editar: objPermiso.per_editar,
            per_ver: objPermiso.per_ver,
          },
        },
      ],
    });
  }

  postCreatePermisos(objPermiso: any) {
    const url = `${this.environment}permisos/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            user_id: objPermiso.user_id,
            opcion_id: objPermiso.opcion_id,
            per_editar: objPermiso.per_editar,
            per_ver: objPermiso.per_ver,
           
          },
        },
      ],
    });
  }

  //Eliminacion de Permisos
  requestdeletePermisos(id: number) {
    let url = `${this.environment}permisos`;
    return this.http.request('DELETE', url, {
      body: {
        resources: [id],
      },
    });
  }


}
