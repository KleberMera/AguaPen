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
import { CheckboxModule } from 'primeng/checkbox';
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
  PasswordModule,
  CheckboxModule,
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
  pageTitle: string = '';
  private sidebarService = inject(SidebarService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService); // Inyección del servicio de mensajes
  private confirmationService = inject(ConfirmationService); // Inyección del servicio de confirmación
  visible: boolean = false;
  user: any = {}; // Initialize user object

  loadingUpdate: boolean = false;
  checked: boolean = false;

  ngOnInit(): void {
    this.sidebarService.title$.subscribe((title) => {
      this.pageTitle = title;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Additional logic if needed
      });

    this.datesUser();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  datesUser() {
    // Get user ID from localStorage
    const userId = localStorage.getItem('usuario_id');
  
    if (userId) {
      this.authService.verDatosUsuario(userId).subscribe((res: any) => {
        if (res && res.usuario) {
          this.user = res.usuario;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo obtener la información del usuario.',
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario no identificado.',
      });
    }
  }
  

  updateUser(event: Event) {
    setTimeout(() => {
      this.loadingUpdate = false;
    }, 2000);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro de que desea actualizar los datos del usuario?',
      header: 'Confirmación de Actualización',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'No',
      accept: () => {
        const updatedUser = { ...this.user };

        this.authService.updateUser(updatedUser).subscribe((res: any) => {
          // Show success message
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización',
            detail: 'Cambios guardados.',
          });

          this.visible = false; // Close dialog
          this.loadingUpdate = false;
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelad0',
          detail: 'Actualización cancelada.',
        });
      },
    });
  }
}
