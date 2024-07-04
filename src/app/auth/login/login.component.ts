import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

const PRIMEMG_MODULES = [
  ToastModule,
  ButtonModule,
  InputTextModule,
  PasswordModule,
  DividerModule,
];
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PRIMEMG_MODULES, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export default class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  private srvAuth = inject(AuthService);
  private srvMensajes = inject(MessageService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    });
  }

  getLogin() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);

    if (this.loginForm.valid) {
      const dataLogin = this.loginForm.value;

      this.srvAuth.login(dataLogin).subscribe((res: any) => {
        if (res.retorno == 1) {
          console.log(res.mensaje);
          this.srvMensajes.add({
            severity: 'success',
            summary: 'Login',
            detail: res.mensaje,
          });

            // Guardar datos en BehaviorSubject
            this.srvAuth.setNombres(res.nombres);
            this.srvAuth.setUsuarioId(res.usuario_id);
   

          this.router.navigate(['home']);
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
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario o clave no introducido',
      });
    }
  }
}
