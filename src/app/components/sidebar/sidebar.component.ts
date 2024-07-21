import { Component, inject, ViewChild } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

const PRIME_MODULES = [
  SidebarModule,
  ButtonModule,
  RippleModule,
  AvatarModule,
  StyleClassModule,
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ PRIME_MODULES, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  private router = inject(Router);

  sidebarVisible: boolean = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarVisible$.subscribe(
      (visible) => (this.sidebarVisible = visible)
    );
  }

  closeCallback(e: any): void {
    this.sidebarService.toggleSidebar();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

 

  menuItems = [
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
          label: 'Productos',
          icon: 'pi pi-shop',
          routerLink: '/home/productos',
          routerActive: 'active',
        },
        {
          label: 'Trabajadores',
          icon: 'pi pi-users',
          routerLink: '/home/usuarios-trabajadores',
        },
        {
          label: 'Registrar',
          icon: 'pi pi-table',
          routerLink: '/home/registros',
        },
      ],
    },
    {
      label: 'Reportes',
      items: [
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
