import { Component, inject, signal } from '@angular/core';
import { AutocompleteComponent } from '../../../../../components/autocomplete/autocomplete.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { userComponentConfigWorker } from '../../../../seguridad-industrial/registros/registros.imports';
import { userComponentConfig } from '../../../permissions/permissions.imports';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  updateUserPayload,
  UserForm,
} from '../../../../../core/payloads/users.payload';
import {
  fieldsFormsUsers,
  UserAttributes,
} from '../../../../../models/users.model';
import { ListService } from '../../../../../services/seguridad-industrial/list.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { HandleErrorService } from '../../../../../services/gen/handle-error.service';
import { toast } from 'ngx-sonner';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-updated',
  standalone: true,
  imports: [
    AutocompleteComponent,
    InputTextModule,
    ButtonModule,
    RippleModule,
    ReactiveFormsModule,
    PasswordModule,
  ],
  templateUrl: './updated.component.html',
  styleUrl: './updated.component.scss',
})
export class UpdatedComponent {
  protected users = signal<UserAttributes[]>([]);
  userConfig = userComponentConfig;
  protected selectedUser = signal<UserAttributes | null>(null);
  readonly userForm = signal<FormGroup>(UserForm());
  loading = signal(false);

  readonly fields = fieldsFormsUsers;

  //Injected
  private readonly srvList = inject(ListService);
  private readonly srvError = inject(HandleErrorService);
  private readonly srvAuth = inject(AuthService);

  ngOnInit(): void {
    this.getListUserApp();
  }

  async onUserSelected(user: UserAttributes) {
    if (user.id) {
      toast.success(`Seleccionado: ${user.nombres} ${user.apellidos}`);
      this.selectedUser.set(user);
      this.showPassword = false;
      this.userForm().get('password')?.disable();

      this.userForm().patchValue({
        ...user,
      });
    }
  }

  async onSaveUser() {
    const form = this.userForm();
    if (!form.valid) return;
    try {
      this.loading.set(true);
      const payload = updateUserPayload(form);
      const res = await this.srvAuth.updateUser(payload).toPromise();

      if (res) {
        toast.success('Usuario actualizado exitosamente');
        this.userForm().reset();
        this.selectedUser.set(null);
        this.showPassword = false;
        this.loading.set(false);

        this.userForm().get('password')?.disable();
      }
    } catch (error) {
      toast.error('Error al actualizar el usuario');
      this.loading.set(false);
    }
  }

  async onClearSelectedUser(autocompleteComp: any) {
    this.showPassword = false;
    this.selectedUser.set(null);
    autocompleteComp.clear(); // Llama a un método 'clear()' en app-autocomplete si está disponible
    toast.info('Selección de usuario eliminada');
    this.userForm().reset();
   
    this.userForm().get('password')?.disable();
  }

  async getListUserApp() {
    try {
      const res = await this.srvAuth.listUsers().toPromise();
      if (res.data) {
        this.users.set(res.data);
      }
    } catch (error) {
      const storeError = this.srvError.getError().error.message;
      toast.error(storeError, {
        position: 'top-right',
      });
    }
  }

  getFieldError(field: string): string | null {
    const control = this.userForm().get(field);
  
    if (control?.hasError('required') && control?.touched) {
      return 'Este campo es requerido.';
    }
  
    if (control?.hasError('minlength') && control?.touched) {
      return `El campo debe tener al menos ${control.getError('minlength').requiredLength} caracteres.`;
    }
  
    if (control?.hasError('maxlength') && control?.touched) {
      return `El campo no debe tener más de ${control.getError('maxlength').requiredLength} caracteres.`;
    }
  
    if (control?.hasError('pattern') && control?.touched) {
      return 'El campo debe tener un formato válido.';
    }
  
    if (control?.hasError('email') && control?.touched) {
      return 'Debe ser un email válido.';
    }
  
    return null;
  }
  
  showPassword: boolean = false;
  onResetPassword() {
    const user = this.selectedUser();
    if (user) {
      this.userForm().get('password')?.enable();
      this.showPassword = true;
      this.userForm().patchValue({
        password: user.cedula,
      });
    }
  }
}
