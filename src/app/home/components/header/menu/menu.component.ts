import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ScrollerModule } from 'primeng/scroller';
import { MenuService } from '../../../../servicios/menu.service';
import { RouterLink } from '@angular/router'
import { PanelMenuModule } from 'primeng/panelmenu';;
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [SidebarModule,ButtonModule,ScrollerModule, RouterLink, PanelMenuModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  sidebarVisible: boolean = false;

  menuItems: any[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.getMenu().subscribe((data: any) => {
      this.menuItems = data.model;
    });
  }
}
