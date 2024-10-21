import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../services/auth/auth.service';
import { FooterComponent } from '../../components/layout/footer/footer.component';
import { Auth } from '../../models/auth.model';

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
  imports: [PRIMEMG_MODULES, ReactiveFormsModule, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export default class LoginComponent {
  imgUrl: string = 'assets/iconapp.webp';
  loading = false;
  formLogin = signal<FormGroup>(
    new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  );

  private srvAuth = inject(AuthService);
  private srvMensajes = inject(MessageService);
  private router = inject(Router);

  async onSubmit() {
    this.loading = true;
    if (this.formLogin().valid) {
      try {
        const loginData: Auth = this.formLogin().value;
        const res: any = await this.srvAuth.login(loginData).toPromise();
        if (res.token) {
          this.srvAuth.setUser(res.usuario, res.token);
          this.srvAuth.setToken(res.token);
          this.srvMensajes.add({
            severity: 'success',
            summary: 'Login',
            detail: 'Inicio de sesión exitoso',
          });
          this.loading = false;
          //Ir al dashboard
          this.router.navigate(['/home']);
        }
      } catch (err: any) {
        this.loading = false;
        this.srvMensajes.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al iniciar sesión',
        });
      }
    }
  }
}
