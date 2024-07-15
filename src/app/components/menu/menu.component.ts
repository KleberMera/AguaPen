import { Component, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [PanelMenuModule, MenuModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
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
        label: 'Listados',
        items: [
          {
            label: 'Productos',
            icon: 'pi pi-shop',
            routerLink: '/home/productos',
            routerActive: 'active',
          },
          {
            label: 'Trabajadores',
            icon: 'pi pi-users',
            routerLink: '/home/usuarios-trabajadores',
          },
        ],
      },
      {
        label: 'Opciones',
        items: [
          {
            label: 'Registros',
            icon: 'pi pi-table',
            routerLink: '/home/registros',
          },
          {
            label: 'Reportes',
            icon: 'pi pi-th-large',
            routerLink: '/home/reportes',
          },
          {
            label: 'R - Usuarios',
            icon: 'pi pi-id-card',
            routerLink: '/home/reportes-usuarios',
          }
        ],
      },
    ];
  }
}
