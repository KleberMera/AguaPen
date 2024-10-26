import { Component, effect, inject, Input, input, signal } from '@angular/core';
import { UserAttributes } from '../../../../../models/users.model';
import { lsUserPermissions } from '../../../../../models/auth.model';
import { PermisosService } from '../../../../../services/auth/permisos.service';
import { HandleErrorService } from '../../../../../services/gen/handle-error.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-panel-update',
  standalone: true,
  imports: [],
  templateUrl: './panel-update.component.html',
  styleUrl: './panel-update.component.scss',
})
export class PanelUpdateComponent {
  user = input.required<UserAttributes | null>();
  protected listModulesUser = signal<lsUserPermissions[]>([]);
  private readonly srvPermisos = inject(PermisosService);
  private readonly srvError = inject(HandleErrorService);



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
      }
    } catch (error) {
      const storeError = this.srvError.getError().error.message;
      toast.error(storeError, {position: 'top-right',});
    }
  }
}
