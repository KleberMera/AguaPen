import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from '../components/menu/menu.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ SidebarModule, ButtonModule, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent {
  sidebarVisible: boolean = false;
}
