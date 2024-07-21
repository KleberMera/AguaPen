import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';

import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';

import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
const PRIMEMG_MODULES = [
  ToolbarModule,
  ButtonModule,
  SplitButtonModule,
  InputTextModule,
  AvatarModule,
  SidebarModule,
  ConfirmPopupModule,
  ToastModule,
];
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ToolbarComponent {
  @Output() menuVisibilityChange = new EventEmitter<boolean>();
  menuVisible: boolean = true;

  //iNJECT
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private sidebarService = inject(SidebarService);
  private router = inject(Router);
  private srvAuth = inject(AuthService);

  ngOnInit() {}

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro que deseas cerrar sesión?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Salir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Se ha cerrado la sesión',
          life: 3000,
        });

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
    this.srvAuth.clearAuthData();
    this.router.navigate(['/auth']);
  }
}
