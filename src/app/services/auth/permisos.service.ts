import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { PayloadPermissionsUpdate } from '../../models/permisos.model';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);
  private permissions = 'userPermissions';

  //Listado de Permisos
  getListPermisos() {
    const url = `${this.environment}permisosmenus`;
    return this.http.get<any>(url);
  }

  getListPermisosPorUsuario(userId: number) {
    const url = `${this.environment}permisosmenus/${userId}`;
    return this.http.get<any>(url).pipe(
      tap((res: any) => {
        localStorage.setItem(this.permissions, JSON.stringify(res.data));
      })
    );
  }

  getLsUserPermissions() {
    return JSON.parse(localStorage.getItem('permissions') || '[]');
  }
  
  getPermissionEditar(modulo_label: string) {
    const userPermissions = JSON.parse(localStorage.getItem(this.permissions) || '[]');
    const permiso = userPermissions.find(
      (permiso: any) => (permiso.modulo_id === 1 || permiso.modulo_id === 2) && permiso.opcion_label === modulo_label);
    return permiso ? permiso.per_editar : false;
  }

  getListModulos() {
    const url = `${this.environment}allmodulos`;
    return this.http.get<any>(url);
  }

  postEditPermisos(objPermiso: PayloadPermissionsUpdate) {
    const url = `${this.environment}permisos/mutate`;
    return this.http.post<PayloadPermissionsUpdate>(url, objPermiso);
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
