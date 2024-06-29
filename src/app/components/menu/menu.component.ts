import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [PanelMenuModule, MenuModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;
    
    ngOnInit() {
        this.items = [
            {
                label: 'Listados',
                items: [
                    {
                        label: 'Productos',
                        icon: 'pi pi-shop',
                        routerLink: '/home/productos'
                    },
                    {
                        label: 'Trabajadores',
                        icon: 'pi pi-users',
                    }
                ]
            },
            {
                label: 'Registros',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out'
                    }
                ]
            }
        ];
    }
  }



