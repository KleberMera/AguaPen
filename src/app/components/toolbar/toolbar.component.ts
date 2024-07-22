import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';

import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';

import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { filter } from 'rxjs';
const PRIMEMG_MODULES = [
  ToolbarModule,
  ButtonModule,
  SplitButtonModule,
  InputTextModule,
  AvatarModule,
  SidebarModule,
  ConfirmPopupModule,
  ToastModule,
];
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ToolbarComponent implements OnInit {
  pageTitle: string = 'Sistema de Gestión';

  private sidebarService = inject(SidebarService);
  private router = inject(Router);

ngOnInit(): void {
  this.sidebarService.title$.subscribe(title => {
    this.pageTitle = title;
  });

  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    // You can keep additional logic here if needed
  });
}

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

 
}
