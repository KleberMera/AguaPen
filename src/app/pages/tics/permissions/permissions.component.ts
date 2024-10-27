import { Component, inject, signal } from '@angular/core';
import { ModulesApp, userComponentConfig } from './permissions.imports';
import { UserAttributes } from '../../../models/users.model';
import { AuthService } from '../../../services/auth/auth.service';
import { HandleErrorService } from '../../../services/gen/handle-error.service';
import { toast } from 'ngx-sonner';
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
    }
  }

  onTabChange(index: number) {
    this.activeTab.set(index);
  }
}
