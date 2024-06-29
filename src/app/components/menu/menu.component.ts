import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
          },
          {
            label: 'Trabajadores',
            icon: 'pi pi-users',
          },
        ],
      },
      {
        label: 'Opciones',
        items: [
         
          {
            label: 'Registros',
            icon: 'pi pi-table',
          },
          {
            label: 'Reportes',
            icon: 'pi pi-th-large',
          },
        
        ],
      },
    ];
  }
}
