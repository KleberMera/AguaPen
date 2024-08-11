import { Component, inject } from '@angular/core';

import { LayoutService } from '../../services/layout.service';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenuitemComponent } from '../menuitem/menuitem.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule,
    MenuModule,
    MenuitemComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [MessageService],
})
export class MenuComponent {
  private srvAuth = inject(AuthService);
  private messageService = inject(MessageService);
  public userSubscription: Subscription = new Subscription();
  rol_id: number = 0;
  model: any[] = [];
  loading: boolean = true;
  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.dataUser();
  }

  dataUser() {
    this.srvAuth.viewDataUser().subscribe((res: any) => {
      if (res) {
        this.rol_id = res.data.rol_id;
        if (this.rol_id === 1 || this.rol_id === 2) {
          this.initializeMenu();
        } else {
          this.initializeMenu2();
        }
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

  initializeMenu() {
    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: '/home/dashboard',
          },
        ],
      },
      {
        label: 'Opciones',
        items: [
          // Condicional para mostrar "Usuarios" solo si rol_id es 1
          ...(this.rol_id === 1
            ? [
                {
                  label: 'Usuarios',
                  icon: 'pi pi-user',
                  routerLink: '/home/roles',
                },
              ]
            : []),
          {
            label: 'Areas',
            icon: 'pi pi-map-marker',
            routerLink: '/home/areas',
          },
          {
            label: 'Productos',
            icon: 'pi pi-shop',
            routerLink: '/home/productos',
          },
          {
            label: 'Vehiculos',
            icon: 'pi pi-car',
            routerLink: '/home/vehiculos',
          },
          {
            label: 'Trabajadores',
            icon: 'pi pi-users',
            routerLink: '/home/trabajadores',
          },
          {
            label: 'Editar/Eliminar',
            icon: 'pi pi-pencil',
            routerLink: '/home/editar-eliminar',
          },
        ],
      },
      {
        label: 'Asignaciones',
        items: [
          {
            label: 'A. Productos',
            icon: 'pi pi-list-check',
            routerLink: '/home/registros',
          },
          {
            label: 'A. Areas ',
            icon: 'pi pi-list-check',
            routerLink: '/home/registros-areas',
          },
          {
            label: 'A. Vehiculos',
            icon: 'pi pi-list-check',
            routerLink: '/home/registros-vehiculos',
          },
        ],
      },
      {
        label: 'Reportes',
        items: [
          {
            label: 'Areas',
            icon: 'pi pi-map-marker',
            routerLink: '/home/reportes-areas',
          },
          {
            label: 'Vehiculos',
            icon: 'pi pi-car',
            routerLink: '/home/reportes-vehiculos',
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
          {
            label: 'Anulados',
            icon: 'pi pi-exclamation-triangle',
            routerLink: '/home/anulados',
          },
        ],
      }
      
    ];
  }

  initializeMenu2() {
    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: '/home/dashboard',
          },
        ],
      },

      {
        label: 'Reportes',
        items: [
          {
            label: 'Areas',
            icon: 'pi pi-map-marker',
            routerLink: '/home/reportes-areas',
          },
          {
            label: 'Vehiculos',
            icon: 'pi pi-car',
            routerLink: '/home/reportes-vehiculos',
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
          {
            label: 'Anulados',
            icon: 'pi pi-exclamation-triangle',
            routerLink: '/home/anulados',
          },
        ],
      }
    ];
  }
}
