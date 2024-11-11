import { Component, inject, input, output, signal } from '@angular/core';
import { UserAttributes } from '../../../../../models/users.model';
import { lsUserPermissions } from '../../../../../models/auth.model';
import { PermisosService } from '../../../../../services/auth/permisos.service';
import { toast } from 'ngx-sonner';
import {
  handlePermissionUpdate,
  processPermissionPayload,
  showConfirmDialogPanelUpdate,
} from './core/panel-update.model';
import { ConfirmationService } from 'primeng/api';
import { SHARED_IMPORTS } from './core/panle-update.imports';
import { PayloadupdateService } from './core/payloadupdate.service';

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
  userChanged = output<UserAttributes>();
  listModules = input.required<lsUserPermissions[]>();
  groupedModules = input.required<
    Array<{
      nombre_modulo: string;
      menus: Array<{ nombre_menu: string; opciones: lsUserPermissions[] }>;
    }>
  >();

  protected listModulesUser = signal<lsUserPermissions[]>([]);
  private readonly srvPermisos = inject(PermisosService);
  private readonly srvConfirm = inject(ConfirmationService);
  private readonly srvPayload = inject(PayloadupdateService);

  async onDelete(opcion: lsUserPermissions, event: Event) {
    showConfirmDialogPanelUpdate(
      this.srvConfirm,
      event,
      async () => {
        const id = opcion.permiso_id;
        const res: any = await this.srvPermisos
          .requestdeletePermisos(id)
          .toPromise();
        if (res.data) {
          toast.success('Opción eliminada correctamente');
          this.userChanged.emit(this.user()!);
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
          // Creamos una función que retorna una Promise
          const refreshCallback = async (user: UserAttributes) => {
            this.userChanged.emit(user);
            return Promise.resolve();
          };

          await processPermissionPayload(
            payload,
            this.srvPermisos,
            currentUser,
            refreshCallback
          );
        } catch (error) {
          console.error('Error en la actualización:', error);
        }
      }
    );
  }

  getInitial(name: any): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  // En tu componente .ts
  getButtonClass(): string {
    return this.user()?.estado === 1 ? 'p-button-danger' : 'p-button-success';
  }

  onUpdateUser(event: any) {
    let message = '';
    if (this.user()?.estado === 1) {
      message = 'Estas seguro de quitarle el acceso al Sistema';
    } else {
      message = 'Estas seguro de darle el acceso al Sistema';
    }
    showConfirmDialogPanelUpdate(
      this.srvConfirm,
      event,
      async () => {
        await this.requestUpdateUser();
      },
      { message: message, header: 'Confirmación' }
    );
  }

  async requestUpdateUser() {
    if (!this.user()) return;

    try {
      const { success, updatedUser, error } =
        await this.srvPayload.updateUserStatus(this.user()!);

      if (success && updatedUser) {
        this.userChanged.emit(updatedUser);
        toast.success('Acceso actualizado correctamente');
      } else {
        toast.error(error || 'Error al actualizar el usuario');
      }
    } catch (error) {
      toast.error('Error inesperado al actualizar el usuario');
    }
  }
}
