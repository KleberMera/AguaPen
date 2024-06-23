import { Component, Injectable, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ToastModule, ButtonModule, RippleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export default class LoginComponent {
  loginForm: FormGroup;

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
    if(this.loginForm.value.usuario == '' || this.loginForm.value.clave == ''){
      this.srvMensajes.add({severity: 'error', summary: 'Error', detail: 'Usuario o clave no introducido'});
    }
  
    if (this.loginForm.valid) {
      const dataLogin = this.loginForm.value;

      this.srvAuth.login(dataLogin).subscribe((res: any) => {
        if (res.retorno == 1) {
          console.log(res.mensaje);
          this.srvMensajes.add({severity: 'success', summary: 'Login', detail: res.mensaje});
         // this.router.navigate(['home']);
        } else {
          console.log(res.mensaje);
          this.srvMensajes.add({severity: 'error', summary: 'Error', detail: res.mensaje});
        }
      });
    }
  }

 
}
