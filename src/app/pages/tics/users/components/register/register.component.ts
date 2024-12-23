import { Component, inject, input, signal } from '@angular/core';
import { AutocompleteComponent } from '../../../../../components/autocomplete/autocomplete.component';
import { userComponentConfigWorker } from '../../../../seguridad-industrial/registros/registros.imports';
import { Worker } from '../../../../../models/workers.model';
import { toast } from 'ngx-sonner';
import { ButtonModule } from 'primeng/button';
import { ListService } from '../../../../../services/seguridad-industrial/list.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  createUserPayload,
  UserForm,
} from '../../../../../core/payloads/users.payload';
import { fieldsFormsUsers } from '../../../../../models/users.model';

import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../../../services/auth/auth.service';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AutocompleteComponent,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    TagModule,
    PasswordModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  protected users = signal<Worker[]>([]);
  userConfig = userComponentConfigWorker;
  protected selectedUser = signal<Worker | null>(null);
  readonly userForm = signal<FormGroup>(UserForm());
  loading = signal(false);

  readonly fields = fieldsFormsUsers;

  //Injected
  private readonly srvList = inject(ListService);
  private readonly srvAuth = inject(AuthService);

  private capitalizeWords(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private separateFullName(fullName: string): {
    nombres: string;
    apellidos: string;
  } {
    const words = fullName.trim().split(' ');
    const middleIndex = Math.ceil(words.length / 2);

    const apellidos = words.slice(0, middleIndex).join(' ');
    const nombres = words.slice(middleIndex).join(' ');

    return {
      nombres: this.capitalizeWords(nombres),
      apellidos: this.capitalizeWords(apellidos),
    };
  }
  async onUserSelected(user: Worker) {
    if (user.id) {
      toast.success(`Seleccionado: ${user.tx_nombre}`);
      this.selectedUser.set(user);
      const { nombres, apellidos } = this.separateFullName(user.tx_nombre);
      this.userForm().get('password')?.enable();
      this.userForm().patchValue({
        cedula: user.tx_cedula,

        nombres: nombres,
        apellidos: apellidos,

        email: user.tx_correo,
        usuario: user.dt_usuario,
        password: user.tx_cedula,
      });
    }
  }

  async onClearSelectedUser(autocompleteComp: any) {
    this.selectedUser.set(null);
    autocompleteComp.clear(); // Llama a un método 'clear()' en app-autocomplete si está disponible
    toast.info('Selección de usuario eliminada');
    this.userForm().reset();
  }

  ngOnInit(): void {
    this.loadDropdown();
  }

  toggleEstado(controlName: string) {
    const currentValue = this.userForm().get(controlName)?.value;
    this.userForm().patchValue({
      [controlName]: currentValue ? 0 : 1,
    });
  }

  async loadDropdown() {
    try {
      const res = await this.srvList.getListUsuarios().toPromise();
      if (res && res.data) {
        const data = res.data.filter((user: Worker) => user.dt_status === 1);
        this.users.set(data);
      }
    } catch (error) {}
  }

  async onSaveUser() {
    const form = this.userForm();
    if (!form.valid) return;
    try {
      this.loading.set(true);
      const payload = createUserPayload(form);
      const res = await this.srvAuth.createUser(payload).toPromise();

      if (res) {
        toast.success('Usuario registrado exitosamente');
        this.loadDropdown();
        this.userForm().reset();
        this.selectedUser.set(null);
        this.loading.set(false);
       
      }
    } catch (error) {
      toast.error('Error al registrar usuario');
      this.loading.set(false);
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
  
}
