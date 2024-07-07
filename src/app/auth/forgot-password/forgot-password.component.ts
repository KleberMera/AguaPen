import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';


const PRIMENG_MODULES = [
  ToastModule,
  ButtonModule,
  InputTextModule,
  PasswordModule,
  DividerModule,
];

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [PRIMENG_MODULES, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService],
})
export default class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading: boolean = false;
  cedulaVerificada: boolean = false;

  private srvAuth = inject(AuthService);
  private srvMensajes = inject(MessageService);

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      cedula: ['', Validators.required],
      nueva_clave: ['', Validators.required],
      confirmar_clave: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('nueva_clave')!.value === form.get('confirmar_clave')!.value 
      ? null : { mismatch: true };
  }

  verifyCedula() {
    const cedula = this.forgotPasswordForm.get('cedula')!.value;

    if (cedula) {
      this.srvAuth.verifyCedula(cedula).subscribe((res: any) => {
        if (res.retorno === 1) {
          this.cedulaVerificada = true;
          this.srvMensajes.add({
            severity: 'success',
            summary: 'Verificación de Cédula',
            detail: res.mensaje,
          });
        } else {
          this.cedulaVerificada = false;
          this.srvMensajes.add({
            severity: 'error',
            summary: 'Error',
            detail: res.mensaje,
          });
        }
      });
    } else {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe ingresar una cédula',
      });
    }
  }

  resetPassword() {
    this.loading = true;

    if (this.forgotPasswordForm.valid && this.cedulaVerificada) {
      const data = this.forgotPasswordForm.value;

      this.srvAuth.resetPassword(data).subscribe((res: any) => {
        this.loading = false;

        if (res.retorno == 1) {
          console.log(res.mensaje);
          this.srvMensajes.add({
            severity: 'success',
            summary: 'Recuperar Clave',
            detail: res.mensaje,
          });
        } else {
          console.log(res.mensaje);
          this.srvMensajes.add({
            severity: 'error',
            summary: 'Error',
            detail: res.mensaje,
          });
        }
      });
    } else {
      this.loading = false;
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Datos no introducidos correctamente o cédula no verificada',
      });
    }
  }
}
