import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { PayloadPermissionsCreate, PayloadPermissionsUpdate } from '../../models/permisos.model';

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

  getListPermissionsDropdown(userId: number) {
    const url = `${this.environment}permisosmenus/${userId}`;
    return this.http.get<any>(url);
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

  postCreatePermisos(objPermiso: PayloadPermissionsCreate) {
    const url = `${this.environment}permisos/mutate`;
    return this.http.post<PayloadPermissionsCreate>(url, objPermiso);
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
