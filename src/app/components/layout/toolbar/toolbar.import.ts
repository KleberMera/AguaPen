import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PayloadUserUpdate } from '../../../models/users.model';

export const PRIMENG_MODULES = [
  ToolbarModule,
  ButtonModule,
  SplitButtonModule,
  InputTextModule,
  AvatarModule,
  SidebarModule,
  ConfirmPopupModule,
  ToastModule,
  DialogModule,
  PasswordModule,
  CheckboxModule,
  ImageModule,
  RippleModule,
  ConfirmDialogModule,
  ProgressSpinnerModule,
];

export function UserForm(): FormGroup {
  return new FormGroup({
    id: new FormControl(null), // ID del usuario, opcional si es un nuevo usuario
    cedula: new FormControl('', [ Validators.required, Validators.minLength(10), Validators.maxLength(10), ]),
    telefono: new FormControl('', [ Validators.minLength(10), Validators.maxLength(10)]),
    nombres: new FormControl('', [ Validators.required, Validators.minLength(3), ]),
    apellidos: new FormControl('', [ Validators.required, Validators.minLength(3), ]),
    email: new FormControl('', [ Validators.email, Validators.minLength(5), Validators.maxLength(255), ]),
    usuario: new FormControl('', [ Validators.required, Validators.minLength(3),]),
    password: new FormControl('', [Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.minLength(8)]),
    estado: new FormControl(1),
  });
}

export function UpdatePayload( userForm: FormGroup, changePassword: boolean): PayloadUserUpdate {
  const formValue = { ...userForm.value };
  // Eliminar confirmPassword del objeto
  delete formValue.confirmPassword;
  const payload: PayloadUserUpdate = {
    mutate: [
      {
        operation: 'update', // Es una operación de actualización
        key: userForm.get('id')?.value, // El id del usuario
        attributes: {
          ...formValue, // Copia de los valores del formulario sin confirmPassword
          ...(changePassword ? { password: userForm.get('password')?.value } : {}), // Asignar nueva contraseña si es necesario
        },
      },
    ],
  };
  return payload;
}
