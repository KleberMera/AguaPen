import { inject, Injectable, signal } from '@angular/core';
import { PermisosService } from '../../../../../../services/auth/permisos.service';
import { HandleErrorService } from '../../../../../../services/gen/handle-error.service';
import { lsUserPermissions } from '../../../../../../models/auth.model';
import { UserAttributes } from '../../../../../../models/users.model';
import { groupModulesByName } from './panle-update.imports';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class UsermodulesService {

  private readonly srvPermisos = inject(PermisosService);
  private readonly srvError = inject(HandleErrorService);

  // Signals
  protected listModulesUser = signal<lsUserPermissions[]>([]);

  // Estructura de módulos agrupados
  private groupedModules: Array<{
    nombre_modulo: string;
    menus: Array<{ nombre_menu: string; opciones: lsUserPermissions[] }>;
  }> = [];

  // Getter para módulos agrupados
  getGroupedModules() {
    return this.groupedModules;
  }

  // Getter para la señal de lista de módulos
  getListModulesSignal() {
    return this.listModulesUser;
  }

  async getListModulesUser(user: UserAttributes) : Promise<any> {
    if (!user?.id) return;
    
    try {
      const res = await this.srvPermisos
        .getListPermisosPorUsuario(user.id)
        .toPromise();
        
      if (res.data) {
        this.listModulesUser.set(res.data);
        this.groupedModules = groupModulesByName(this.listModulesUser());
        return this.groupedModules;
      }
    } catch (error) {
      const storeError = this.srvError.getError().error.message;
      toast.error(storeError);
      throw error;
    }
  }
}
