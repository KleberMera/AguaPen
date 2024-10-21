import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { NavigationEnd, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';

import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { filter } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { MenuComponent } from '../menu/menu.component';
import { AuthService } from '../../../services/auth/auth.service';
import { LayoutService } from '../../../services/gen/layout.service';


const PRIME_MODULES = [
  SidebarModule,
  ButtonModule,
  RippleModule,
  AvatarModule,
  StyleClassModule,
  ImageModule,
  ConfirmPopupModule,
  ToastModule,
  MenuModule,
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PRIME_MODULES, CommonModule, MenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class SidebarComponent{
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  sidebarVisible: boolean = false;
  nombres: string | null = '';
  usuario_id: string | null = '';
  apellidos: string | null = '';

  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  constructor(
    public layoutService: LayoutService, public el: ElementRef
  ) {}

  
  
 
}
