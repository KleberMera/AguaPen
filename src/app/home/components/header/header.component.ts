import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PanelMenuModule } from 'primeng/panelmenu';;
import { SidebarModule } from 'primeng/sidebar';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuComponent, ButtonModule, ToolbarModule, SplitButtonModule, PanelMenuModule, SidebarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  menuItems: any[] = [];
  showMenu: boolean = false;

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Authentication',
        items: [
          {
            label: 'Ingresar',
            icon: 'pi pi-fw pi-sign-in',
            routerLink: ['login']
          },
          {
            label: 'Registrar',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['register']
          }
        ]
      },
      {
        label: 'Navigation',
        items: [
          {
            label: 'Productos',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/productos']
          },
          {
            label: 'Personal',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/staff']
          }
        ]
      }
    ];
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onUserButtonClick() {
    // Lógica para el botón de usuario
  }

}
