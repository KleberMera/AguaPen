import { Component, inject, input, signal } from '@angular/core';
import { UserAttributes } from '../../../../../models/users.model';
import { lsUserPermissions } from '../../../../../models/auth.model';
import { PermisosService } from '../../../../../services/auth/permisos.service';
import { HandleErrorService } from '../../../../../services/gen/handle-error.service';
import { toast } from 'ngx-sonner';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Ripple } from 'primeng/ripple';

import {
  handlePermissionUpdate,
  processPermissionPayload,
} from './panel-update.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { showConfirmDialog } from './panle.sms';
@Component({
  selector: 'app-panel-update',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, Ripple, ConfirmDialogModule],
  templateUrl: './panel-update.component.html',
  styleUrl: './panel-update.component.scss',
  providers: [ConfirmationService],
})
export class PanelUpdateComponent {
  user = input.required<UserAttributes | null>();
  protected listModulesUser = signal<lsUserPermissions[]>([]);
  private readonly srvPermisos = inject(PermisosService);
  private readonly srvError = inject(HandleErrorService);
  private readonly srvConfirm = inject(ConfirmationService);
  groupedModules: Array<{
    nombre_modulo: string;
    menus: Array<{ nombre_menu: string; opciones: lsUserPermissions[] }>;
  }> = [];

  ngOnInit(): void {
    if (this.user()) {
      this.getListModulesUser(this.user()!);
    }
  }

  async getListModulesUser(user: UserAttributes) {
    const userId = user.id;
    try {
      const res = await this.srvPermisos.getListPermisosPorUsuario(userId).toPromise();
      if (res.data) {
        this.listModulesUser.set(res.data);
        console.log(this.listModulesUser());
        this.groupedModules = this.groupModulesByName();
      }
    } catch (error) {
      const storeError = this.srvError.getError().error.message;
      toast.error(storeError);
    }
  }

  // Agrupar módulos y menús con tipos explícitos
  groupModulesByName() {
    const modulesMap = new Map<
      string,
      {
        nombre_modulo: string;
        menus: Map<
          string,
          { nombre_menu: string; opciones: lsUserPermissions[] }
        >;
      }
    >();

    this.listModulesUser().forEach((item) => {
      if (!modulesMap.has(item.nombre_modulo)) {
        modulesMap.set(item.nombre_modulo, {
          nombre_modulo: item.nombre_modulo,
          menus: new Map(),
        });
      }
      const module = modulesMap.get(item.nombre_modulo)!;

      if (!module.menus.has(item.nombre_menu)) {
        module.menus.set(item.nombre_menu, {
          nombre_menu: item.nombre_menu,
          opciones: [],
        });
      }
      const menu = module.menus.get(item.nombre_menu)!;

      menu.opciones.push(item);
    });

    return Array.from(modulesMap.values()).map((module) => ({
      nombre_modulo: module.nombre_modulo,
      menus: Array.from(module.menus.values()),
    }));
  }

  async onDelete(opcion: lsUserPermissions, event: Event) {
    showConfirmDialog(
      this.srvConfirm,
      event,
      async () => {
        const res: any = await this.srvPermisos
          .requestdeletePermisos(opcion.opcion_id)
          .toPromise();

        if (res.data) {
          toast.success('Opción eliminada correctamente');
          await this.getListModulesUser(this.user()!);
        }
      },
      {
        message: '¿Estás seguro de eliminar esta opción?',
        header: 'Confirmación',
      }
    );
  }

  onUpdate(opcion: lsUserPermissions, tipo: 'ver' | 'editar', event: Event) {
    const userId = this.user()?.id;
    const currentUser = this.user();
    handlePermissionUpdate(
      event,
      opcion,
      tipo,
      userId,
      this.srvConfirm,
      async (payload) => {
        try {
          await processPermissionPayload(
            payload,
            this.srvPermisos,
            currentUser,
            this.getListModulesUser.bind(this)
          );
        } catch (error) {
          console.error('Error en la actualización:', error);
        }
      }
    );
  }
}
