import { Component, inject, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { filter } from 'rxjs';

const PRIMENG_MODULES = [
  ToolbarModule,
  ButtonModule,
  SplitButtonModule,
  InputTextModule,
  AvatarModule,
  SidebarModule,
  ConfirmPopupModule,
  ToastModule,
  DialogModule,
  PasswordModule
];

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [PRIMENG_MODULES, FormsModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ToolbarComponent implements OnInit {
  pageTitle: string = 'Sistema de Gestión';
  private sidebarService = inject(SidebarService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService); // Inyección del servicio de mensajes
  private confirmationService = inject(ConfirmationService); // Inyección del servicio de confirmación
  visible: boolean = false;
  user: any = {}; // Initialize user object
  originalUser: any = {}; // To store the original user data

  ngOnInit(): void {
    this.sidebarService.title$.subscribe(title => {
      this.pageTitle = title;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Additional logic if needed
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  openUserDialog() {
    // Get user ID from localStorage
    const userId = localStorage.getItem('usuario_id');
    
    if (userId) {
      this.authService.verDatosUsuario({ id: userId }).subscribe(response => {
        console.log('Datos del usuario recibidos:', response);
        
        // Type assertion to handle response structure
        const responseData = response as { usuario?: any };
        
        if (responseData && responseData.usuario) {
          this.originalUser = { ...responseData.usuario }; // Store the original data
          this.user = responseData.usuario; // Load nested usuario data
          this.visible = true; // Show dialog
        } else {
          console.error('Datos de usuario no encontrados en la respuesta');
        }
      });
    } else {
      console.error('ID de usuario no encontrado en localStorage');
    }
  }

  updateUser() {
    // Verify that all required fields are filled
    if (!this.user.telefono || !this.user.nombres || !this.user.apellidos || !this.user.correo || !this.user.usuario) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Vacíos',
        detail: 'Por favor, complete todos los campos antes de actualizar.'
      });
      return;
    }

    // Confirm update action
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea actualizar los datos del usuario?',
      header: 'Confirmación de Actualización',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Check if the password field has been changed
        const updatedUser = { ...this.user };
        
        if (this.user.clave === this.originalUser.clave) {
          delete updatedUser.clave; // Remove password if it hasn't been changed
        }

        this.authService.updateUser(updatedUser).subscribe(response => {
          // Show success message
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización Exitosa',
            detail: 'Los datos del usuario han sido actualizados correctamente.'
          });
          this.visible = false; // Close dialog
        }, error => {
          // Show error message
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar los datos del usuario. Inténtalo nuevamente.'
          });
        });
      },
      reject: () => {
        // Action when user rejects the confirmation
        this.messageService.add({
          severity: 'info',
          summary: 'Actualización Cancelada',
          detail: 'La actualización de los datos ha sido cancelada.'
        });
      }
    });
  }

  closeDialog() {
    this.visible = false; // Close dialog
  }
}
