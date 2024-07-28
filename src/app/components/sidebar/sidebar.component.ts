import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { filter } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { MenuComponent } from '../menu/menu.component';
import { LayoutService } from '../../services/layout.service';

const PRIME_MODULES = [
  SidebarModule,
  ButtonModule,
  RippleModule,
  AvatarModule,
  StyleClassModule,
  ImageModule,
  ConfirmPopupModule,
  ToastModule,
  MenuModule,
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PRIME_MODULES, CommonModule, MenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  sidebarVisible: boolean = false;
  nombres: string | null = '';
  usuario_id: string | null = '';
  apellidos: string | null = '';

  private router = inject(Router);
  private srvAuth = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  constructor(private sidebarService: SidebarService,
    public layoutService: LayoutService, public el: ElementRef
  ) {}

  ngOnInit() {
    this.authDates();
   /* this.sidebarService.sidebarVisible$.subscribe((visible) => {
      this.sidebarVisible = visible;
      if (this.sidebarRef) {
        this.sidebarRef.visible = visible;
      }
    });
    

    // Cerrar el sidebar al navegar a una nueva página
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.sidebarService.setSidebarVisible(false);
      });

    document.addEventListener('click', (e: any) => {
      if (!e.target.matches('.sidebarOpen')) {
        if (this.sidebarVisible === false) {
          this.sidebarService.setSidebarVisible(false);
        }
      }
    });
  }

  closeCallback(e: any): void {
    this.sidebarService.setSidebarVisible(false);
  }

  navigateTo(route: string): void {
    const menuItem = this.findMenuItemByRoute(route);
    if (menuItem) {
      this.sidebarService.setTitle(menuItem.label);
      this.router.navigate([route]);
    }
 */
  } 

  findMenuItemByRoute(route: string) {
    for (const menu of this.menuItems) {
      for (const item of menu.items) {
        if (item.routerLink === route) {
          return item;
        }
      }
    }
    return null;
  }

  menuItems = [
    {
      label: 'Home',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/home/dashboard',
        },
        {
          label: 'Roles',
          icon: 'pi pi-user',
          routerLink: '/home/usuarios-roles',
        }
      ],
    },
    {
      label: 'Opciones',
      items: [
        {
          label: 'Productos',
          icon: 'pi pi-shop',
          routerLink: '/home/productos',
        },
        {
          label: 'Trabajadores',
          icon: 'pi pi-users',
          routerLink: '/home/usuarios-trabajadores',
        },
        {
          label: 'Asignaciones',
          icon: 'pi pi-list-check',
          routerLink: '/home/registros',
        },
        {
          label: 'Asignaciones por Area ',
          icon: 'pi pi-list-check',
          routerLink: '/home/regx-area',
        },
      ],
    },
    {
      label: 'Reportes',
      items: [
        {
          label: 'Areas',
          icon: 'pi pi-map-marker',
          routerLink: '/home/areas',
        },
        {
          label: 'General',
          icon: 'pi pi-th-large',
          routerLink: '/home/reportes',
        },
        {
          label: 'Detalles',
          icon: 'pi pi-id-card',
          routerLink: '/home/reportes-usuarios',
        },
      ],
    },
  ];

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

  authDates() {
    
    
  }

 
}
