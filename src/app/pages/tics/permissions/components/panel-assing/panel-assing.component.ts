import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { UserAttributes } from '../../../../../models/users.model';
import { lsUserPermissions } from '../../../../../models/auth.model';
import { PermisosService } from '../../../../../services/auth/permisos.service';
import { toast } from 'ngx-sonner';
import { HandleErrorService } from '../../../../../services/gen/handle-error.service';
import { groupModulesByName } from '../panel-update/panle-update.imports';

@Component({
  selector: 'app-panel-assing',
  standalone: true,
  imports: [],
  templateUrl: './panel-assing.component.html',
  styleUrl: './panel-assing.component.scss',
})
export class PanelAssingComponent {
  user = input.required<UserAttributes | null>();
  protected listAllModules = signal<lsUserPermissions[]>([]);
  protected listModulesUser = signal<lsUserPermissions[]>([]);
  private readonly srvPermisos = inject(PermisosService);
  private readonly srvError = inject(HandleErrorService);
  groupedModules: Array<{ nombre_modulo: string; menus: Array<{ nombre_menu: string; opciones: lsUserPermissions[] }> }> = [];

  ngOnInit(): void {
    this.getAllModules();
  }

  async getAllModules() {
    try {
      const res = await this.srvPermisos.getListModulos().toPromise();
      if (res.data) {
        this.listAllModules.set(res.data);
        console.log(this.listAllModules());
        await this.getListModulesUser(this.user()!);
        
      }
    } catch (error) {}
  }

  async getListModulesUser(user: UserAttributes) {
    const userId = user.id;
    try {
      const res = await this.srvPermisos
        .getListPermisosPorUsuario(userId)
        .toPromise();
      if (res.data) {
        this.listModulesUser.set(res.data);
        console.log(this.listModulesUser());
        const missingModules = this.getMissingModules();
        this.groupedModules = groupModulesByName(missingModules);
      }
    } catch (error) {
      const storeError = this.srvError.getError().error.message;
      toast.error(storeError);
    }
  }

  getMissingModules() {
  // Obtener los ids de opciones en los módulos del usuario
  const userModuleIds = new Set(this.listModulesUser().map(module => module.opcion_id));
  // Filtrar los módulos de `listAllModules` que no están en `listModulesUser`
  const missingModules = this.listAllModules().filter(module => !userModuleIds.has(module.opcion_id));

  return missingModules;
}

}
