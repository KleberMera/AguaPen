import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { UserAttributes } from '../../../../../models/users.model';
import { lsUserPermissions } from '../../../../../models/auth.model';
import { PermisosService } from '../../../../../services/auth/permisos.service';
import { toast } from 'ngx-sonner';
import { HandleErrorService } from '../../../../../services/gen/handle-error.service';
import { groupModulesByName } from '../panel-update/panle-update.imports';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { PayloadPermissionsCreate } from '../../../../../models/permisos.model';

@Component({
  selector: 'app-panel-assing',
  standalone: true,
  imports: [TagModule, ButtonModule],
  templateUrl: './panel-assing.component.html',
  styleUrl: './panel-assing.component.scss',
})
export class PanelAssingComponent {
  user = input.required<UserAttributes | null>();
  protected listAllModules = signal<lsUserPermissions[]>([]);
  protected listModulesUser = signal<lsUserPermissions[]>([]);
  private readonly srvPermisos = inject(PermisosService);
  private readonly srvError = inject(HandleErrorService);
  groupedModules: Array<{
    nombre_modulo: string;
    menus: Array<{ nombre_menu: string; opciones: lsUserPermissions[] }>;
  }> = [];

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
    const userModuleIds = new Set(
      this.listModulesUser().map((module) => module.opcion_id)
    );
    // Filtrar los módulos de `listAllModules` que no están en `listModulesUser`
    const missingModules = this.listAllModules().filter(
      (module) => !userModuleIds.has(module.opcion_id)
    );

    return missingModules;
  }

  async onAssign(opcion: lsUserPermissions) {
   
  
    // Asegura que per_editar y per_ver nunca sean undefined
    const userId = this.user()?.id ;

    const payload: PayloadPermissionsCreate = {
      mutate: [
        {
          operation: 'create',
          attributes: {
            id: 0,
            user_id: userId  ?? 0,
            opcion_id: opcion.opcion_id,
            per_editar: Boolean(opcion.per_editar ?? 0),
            per_ver: Boolean(opcion.per_ver ?? 0),
          },
        },
      ],
    };
  
    console.log('Payload para crear permisos:', payload);
    try {
      const res = await this.srvPermisos.postCreatePermisos(payload).toPromise();
      console.log(res);
      this.getListModulesUser(this.user()!);
    } catch (error) {
      
    }


    // Aquí iría la lógica para enviar el payload
  }
  
}
