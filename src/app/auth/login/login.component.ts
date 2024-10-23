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
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ImageModule } from 'primeng/image';
import { HandleErrorService } from '../../services/gen/handle-error.service';
import { toast } from 'ngx-sonner';
const PRIMEMG_MODULES = [
  ToastModule,
  ButtonModule,
  InputTextModule,
  PasswordModule,
  DividerModule,
  InputIconModule,
  IconFieldModule,
  FloatLabelModule,
  ImageModule,
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

  private readonly srvAuth = inject(AuthService);
  private readonly  srvError = inject(HandleErrorService);
  private readonly router = inject(Router);

  async onSubmit() {
    this.loading = true;
    if (this.formLogin().valid) {
      try {
        const loginData: Auth = this.formLogin().value;
        const res: any = await this.srvAuth.login(loginData).toPromise();
        if (res.token) {
          this.srvAuth.setUser(res.usuario, res.token);
          this.srvAuth.setToken(res.token);
          toast.success('Login exitoso',{
            position: 'top-right', 
          });
          this.loading = false;
          this.router.navigate(['/home']);
        }
      } catch (err: any) {
        const storeError = this.srvError.getError().error.message;
        this.loading = false;
        toast.error(storeError, {
          position: 'top-right',  
        });
      }
    }
  }
}
