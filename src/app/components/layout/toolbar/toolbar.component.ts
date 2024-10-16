import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from './toolbar.import';


import { ThemesComponent } from '../../themes/themes.component';
import { AuthService } from '../../../services/services_auth/auth.service';
import { LayoutService } from '../../../services/gen/layout.service';
import { MutatePayloadUpdate, UserAttributes } from '../../../models/users.interfaces';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [PRIMENG_MODULES, FormsModule, CommonModule, ThemesComponent],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ToolbarComponent implements OnInit {
  visible: boolean = false;
  loadingUpdate: boolean = false;
  user!: UserAttributes; // Initialize user object
  checked: boolean = false;
  items!: MenuItem[];
  imgUrl: string = 'assets/ICONO-AGUAPEN.webp';
  changePassword: boolean = false; // Para controlar el checkbox
  password: string = ''; // Nueva contraseña
  confirmPassword: string = ''; // Confirmar nueva contraseña
  loading: boolean = true;

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  private router = inject(Router);
  private srvAuth = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  public layoutService = inject(LayoutService);

  ngOnInit(): void {}

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
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Denegado',
          detail: 'Cancelado',
          life: 3000,
        });
      },
    });
  }

  signOut() {
    this.srvAuth.logout().subscribe((res) => {
      console.log(res);
      
      this.router.navigate(['/auth']);
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmado',
        detail: res.message,
      });
     
    });
  }

  dataUser() {
    this.srvAuth.getLoginUser().subscribe((res) => {
      if (res.data) {  
        const { id, cedula, telefono, nombres, apellidos, email, usuario, estado, password} = res.data; 
        this.user = {id, cedula, telefono, nombres, apellidos, email, usuario, estado, password};
        this.loading = false;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener la información del usuario.',
        });
      }
    });
  }
  

  updateUser(event: Event) {
    this.loadingUpdate = true;
    // Validar si la nueva contraseña coincide
    if (this.changePassword && this.password !== this.confirmPassword) {
      this.loadingUpdate = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden.',
      });
      return;
    }

    //Validar que la contraseña no sea igual al usuario
    if (this.user.usuario === this.password) {
      this.loadingUpdate = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña no puede ser igual al usuario.',
      });
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
        const payload: MutatePayloadUpdate = {
          mutate: [
            {
              operation: 'update', // Es una operación de actualización
              key: this.user.id as number, // El id del usuario
              attributes: {
                ...this.user,
                ...(this.changePassword ? { password: this.password } : {}), // Asignar nueva contraseña solo si es necesario
              },
            },
          ],
        };

        this.srvAuth.updateUser(payload).subscribe((res: any) => {
          // Show success message
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización',
            detail: 'Cambios guardados.',
          });

          this.visible = false; // Close dialog
          this.loadingUpdate = false;

          // Si se cambió la contraseña, cerrar sesión
          if (this.changePassword) {
            this.signOut();
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelad0',
          detail: 'Actualización cancelada.',
        });
        this.loadingUpdate = false;
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
}
