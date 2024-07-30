import { Component } from '@angular/core';


import { LayoutService } from '../../services/layout.service';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenuitemComponent } from '../menuitem/menuitem.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ MenuComponent, FormsModule, MenuModule, MenuitemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
 
    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
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
                {
                  label: 'Usuarios',
                  icon: 'pi pi-user',
                  routerLink: '/home/roles',
                },{
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
                }
                
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
    }
}