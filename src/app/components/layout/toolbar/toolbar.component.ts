import {Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES, UpdatePayload, UserForm } from './toolbar.import';

import { AuthService } from '../../../services/auth/auth.service';
import { LayoutService } from '../../../services/gen/layout.service';
import { ThemesComponent } from '../themes/themes.component';
import { toast } from 'ngx-sonner';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ PRIMENG_MODULES, FormsModule, CommonModule, ThemesComponent, ReactiveFormsModule ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ToolbarComponent {
  userForm = signal<FormGroup>(UserForm());
  visible: boolean = false;
  loadingUpdate: boolean = false;
  checked: boolean = false;
  items!: MenuItem[];
  imgUrl: string = 'assets/ICONO-AGUAPEN.webp';
  changePassword!: boolean; // Para controlar el checkbox
  loading: boolean = true;
  password!: string;

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  private router = inject(Router);
  private srvAuth = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  public layoutService = inject(LayoutService);

  logout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro que deseas cerrar sesión?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Salir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.signOut();
      },
    });
  }

  async signOut() {
    const res = await this.srvAuth.logout().toPromise();
    console.log(res.message);
    this.router.navigate(['/auth']);
    this.messageService.add({
      severity: 'info',
      summary: 'Confirmado',
      detail: res.message,
    });
  }

  async dataUser() {
    try {
      const res = await this.srvAuth.getLoginUser().toPromise();
      if (res?.data) {
        this.userForm().patchValue(res.data);
        this.password = res.data.password;
        this.loading = false;
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      this.loading = false;
    }
  }

  togglePassword() {
    const passwordValue = this.changePassword ? '' : this.password;
    this.userForm().patchValue({
      password: passwordValue,
      confirmPassword: passwordValue,
    });
  }

  validateUserForm(): boolean {
    if (this.changePassword && this.userForm().get('password')?.value !== this.userForm().get('confirmPassword')?.value) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden.',
      });
      return false;
    }
    if (this.userForm().get('usuario')?.value === this.userForm().get('password')?.value) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña no puede ser igual al usuario.',
      });
      return false;
    }
    //Verificar si el formulario es válido
    if (!this.userForm().valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El formulario no es válido.',
      });
      return false;
    }
    return true;
    
      
  }
  
  updateUser(event: Event) {
    this.loadingUpdate = true;
    // Llamar a la función de validación
    if (!this.validateUserForm()) {
      this.loadingUpdate = false;
      return;
    }
  
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro de que desea actualizar los datos del usuario?',
      header: 'Confirmación de Actualización',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'No',
      accept: () => {
        const payload = UpdatePayload(this.userForm(), this.changePassword);
        this.srvAuth.updateUser(payload).subscribe((res: any) => {
          // Mostrar mensaje de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización',
            detail: 'Cambios guardados.',
          });
          this.visible = false;
          this.loadingUpdate = false;
          if (this.changePassword) {
            this.signOut();
          }
        });
      },
    });
  }

  accionThemes() {
    this.messageService.add({
      severity: 'info',
      summary: 'Confirmado',
      detail: 'Se ha cambiado el tema',
      life: 3000,
    });
  }


  cache() {
    //Limpiar todo el localStorage
    localStorage.clear();
    toast.success('Cache limpiado, recargar pantalla');
  }

  
}
