import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [SidebarModule,ButtonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  sidebarVisible: boolean = false;

  model: any[] = [];
}
