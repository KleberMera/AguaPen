import { Component, inject, signal } from '@angular/core';
import { ModulesApp, userComponentConfig } from './permissions.imports';
import { UserAttributes } from '../../../models/users.model';
import { AuthService } from '../../../services/auth/auth.service';
import { HandleErrorService } from '../../../services/gen/handle-error.service';
import { toast } from 'ngx-sonner';
import { lsUserPermissions } from '../../../models/auth.model';
import { PermisosService } from '../../../services/auth/permisos.service';
import { groupModulesByName } from './components/panel-update/core/panle-update.imports';

interface groupedModules {
    nombre_modulo: string;
    menus: Array<{ nombre_menu: string; opciones: lsUserPermissions[] }>;
}
@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [ModulesApp],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export default class PermissionsComponent {
  protected listUserApp = signal<UserAttributes[]>([]);
  protected selectedUser = signal<UserAttributes | null>(null);
  protected listModulesUser = signal<lsUserPermissions[]>([]);
  protected groupedModules = signal<Array<groupedModules>>([]);


  activeTab = signal<number>(0);
  userConfig = userComponentConfig;

  private readonly srvAuth = inject(AuthService);
  private readonly srvError = inject(HandleErrorService);
  private readonly srvPermisos = inject(PermisosService);

  async onClearSelectedUser(autocompleteComp: any) {
    this.selectedUser.set(null);
    this.listModulesUser.set([]);
    this.groupedModules.set([]);
    autocompleteComp.clear();
    toast.info('Selección de usuario eliminada');
  }

  ngOnInit(): void {
    this.getListUserApp();
  }

  onUserChanged(updatedUser: UserAttributes) {
    this.selectedUser.set(updatedUser);
    if (updatedUser) {
      this.getListModulesUser(updatedUser);
    }
  }

  async getListModulesUser(user: UserAttributes) {
    if (!user?.id) return;
    try {
      const res = await this.srvPermisos.getListPermissionsDropdown(user.id).toPromise();
      if (res.data) {
        this.listModulesUser.set(res.data);
        this.groupedModules.set(groupModulesByName(this.listModulesUser()));
      }
    } catch (error) {
      const storeError = this.srvError.getError().error.message;
      toast.error(storeError);
    }
  }

  async getListUserApp() {
    try {
      const res = await this.srvAuth.listUsers().toPromise();
      if (res.data) {
        this.listUserApp.set(res.data);
      }
    } catch (error) {
      const storeError = this.srvError.getError().error.message;
      toast.error(storeError, {
        position: 'top-right',
      });
    }
  }

  async onUserSelected(user: UserAttributes) {
    if (user.id) {
      toast.success(`Seleccionado: ${user.nombres} ${user.apellidos}`);
      this.activeTab.set(0);
      this.selectedUser.set(user);
      await this.getListModulesUser(user);
    }
  }

  onTabChange(index: number) {
    this.activeTab.set(index);
  }
}
