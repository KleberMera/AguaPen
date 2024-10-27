import { Component, inject, input, signal } from '@angular/core';
import { UserAttributes } from '../../../../../models/users.model';
import { lsUserPermissions } from '../../../../../models/auth.model';
import { PermisosService } from '../../../../../services/auth/permisos.service';
import { HandleErrorService } from '../../../../../services/gen/handle-error.service';
import { toast } from 'ngx-sonner';
import { groupModulesByName, SHARED_IMPORTS } from './panle-update.imports';
import { handlePermissionUpdate, processPermissionPayload, showConfirmDialogPanelUpdate} from './panel-update.model';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-panel-update',
  standalone: true,
  imports: [SHARED_IMPORTS],
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
        this.groupedModules = groupModulesByName(this.listModulesUser());
      }
    } catch (error) {
      const storeError = this.srvError.getError().error.message;
      toast.error(storeError);
    }
  }
  async onDelete(opcion: lsUserPermissions, event: Event) {
    showConfirmDialogPanelUpdate(
      this.srvConfirm, event,
      async () => {
        const id = opcion.permiso_id;
        const res: any = await this.srvPermisos.requestdeletePermisos(id).toPromise();
        if (res.data) {
          toast.success('Opción eliminada correctamente');
          await this.getListModulesUser(this.user()!);
        }},
      { message: '¿Estás seguro de eliminar esta opción?', header: 'Confirmación'});
  }

  onUpdate(opcion: lsUserPermissions, tipo: 'ver' | 'editar', event: Event) {
    const userId = this.user()?.id;
    const currentUser = this.user();
    handlePermissionUpdate(event, opcion ,tipo, userId,
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
