import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';

const PRIMEMG_MODULES = [
  ToastModule,
  ButtonModule,
  InputTextModule,
  PasswordModule,
  DividerModule,
];

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [PRIMEMG_MODULES, RouterLink, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService]
})
export default class ForgotPasswordComponent {
  cedula: string = '';
  nuevaClave: string = '';
  objusuario: any;
  loading: boolean = false;

  private srvAuth = inject(AuthService);
  private srvMensajes = inject(MessageService);
  private router = inject(Router);

  recuperarClave() {
    this.objusuario = {
      cedula: this.cedula,
      nueva_clave: this.nuevaClave
    };
    console.log('Función recuperarClave() ejecutada');
    console.log('Cédula:', this.cedula);
    console.log('Nueva Contraseña:', this.nuevaClave);

    this.loading = true;
    this.srvAuth.recuperarContraseña(this.objusuario).subscribe({
      next: (res: any) => {
        if (res.retorno == 1) {
          console.log(res.mensaje);
          this.srvMensajes.add({
            severity: 'success',
            summary: 'Recuperación Exitosa',
            detail: 'La contraseña ha sido actualizada correctamente.',
          });
          history.back(); // Regresar a la página anterior después de la recuperación exitosa
        } else {
          console.log(res.mensaje);
          this.srvMensajes.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al intentar recuperar la contraseña.',
          });
          console.error('Error al recuperar contraseña:', res.mensaje);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al recuperar contraseña:', err);
        this.srvMensajes.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al intentar recuperar la contraseña.',
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  cancelarRecuperacion() {
    // Implementa la lógica para cancelar la recuperación de contraseña si es necesario
    this.router.navigate(['auth']);
  }
}
