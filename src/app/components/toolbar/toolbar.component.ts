import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';

import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';

import { SidebarService } from '../../services/sidebar.service';
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
  imports: [PRIMEMG_MODULES],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  
  @Output() menuVisibilityChange = new EventEmitter<boolean>();
  menuVisible: boolean = true;

  ngOnInit() {
   
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    this.menuVisibilityChange.emit(this.menuVisible);
  }


  logout() {
    //Cerrar sesión
    
  }
}
