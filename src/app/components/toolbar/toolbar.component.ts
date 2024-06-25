import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';

import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { SidebarComponent } from '../sidebar/sidebar.component';
const PRIMEMG_MODULES = [
  ToolbarModule,
  ButtonModule,
  SplitButtonModule,
  InputTextModule,
  AvatarModule,
  SidebarModule,
];
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [PRIMEMG_MODULES, SidebarComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  items: MenuItem[] | undefined;

  menuOpen = false;

  ngOnInit() {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
