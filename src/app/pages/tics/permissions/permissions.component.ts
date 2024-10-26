import { Component, inject, OnInit, signal } from '@angular/core';

import { UserAttributes } from '../../../models/users.model';
import { FormsModule } from '@angular/forms';
import { ListService } from '../../../services/seguridad-industrial/list.service';
import { HandleErrorService } from '../../../services/gen/handle-error.service';
import { AuthService } from '../../../services/auth/auth.service';
import { PermisosService } from '../../../services/auth/permisos.service';
import { toast } from 'ngx-sonner';
import { lsUserPermissions } from '../../../models/auth.model';
import { AutocompleteComponent } from '../../../components/autocomplete/autocomplete.component';
import { userComponentConfig } from './permissions.imports';
import { TabViewModule } from 'primeng/tabview';
import { PanelAssingComponent } from './components/panel-assing/panel-assing.component';
import { PanelUpdateComponent } from './components/panel-update/panel-update.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
const components = [
  PanelAssingComponent,
  PanelUpdateComponent,
  ButtonModule,
  RippleModule,
];
@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [AutocompleteComponent, FormsModule, TabViewModule, components],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export default class PermissionsComponent {
  protected listUserApp = signal<UserAttributes[]>([]);
  protected selectedUser = signal<UserAttributes | null>(null);
  activeTab = signal<number>(0);
  userConfig = userComponentConfig;
  clear = false;
  private readonly srvAuth = inject(AuthService);
  private readonly srvError = inject(HandleErrorService);
  
  async onClearSelectedUser(autocompleteComp: any) {
    this.selectedUser.set(null);
    autocompleteComp.clear(); // Llama a un método 'clear()' en app-autocomplete si está disponible
    toast.info('Selección de usuario eliminada');
  }

  ngOnInit(): void {
    this.getListUserApp();
  }

  async getListUserApp() {
    try {
      const res = await this.srvAuth.listUsers().toPromise();
      console.log(res);
      if (res.data) {
        this.listUserApp.set(res.data);
        console.log(this.listUserApp());
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
    }
  }

  onTabChange(index: number) {
    this.activeTab.set(index);
  }
}
