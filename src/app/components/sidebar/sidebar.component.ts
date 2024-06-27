import { Component, EventEmitter, OnInit, Output, computed, inject } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

const PRIMEMG_MODULES = [
  SidebarModule,
  ButtonModule,
  RippleModule,
  AvatarModule,
  StyleClassModule,
  PanelMenuModule,
  BadgeModule,
];
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PRIMEMG_MODULES, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  sidebarVisible: boolean = true;

  items: MenuItem[] = [];

  visible: boolean = false;

  @Output() sidebarVisibilityChange = new EventEmitter<boolean>();

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((visible) => {
      console.log('Sidebar visibility changed to', visible);
      this.visible = visible;
      this.sidebarVisibilityChange.emit(this.visible);
    });
  

    this.items = [
      {
        label: 'Mail',
        icon: 'pi pi-envelope',
        badge: '5',
        items: [
          {
            label: 'Compose',
            icon: 'pi pi-file-edit',
            shortcut: '⌘+N',
          },
          {
            label: 'Inbox',
            icon: 'pi pi-inbox',
            badge: '5',
          },
          {
            label: 'Sent',
            icon: 'pi pi-send',
            shortcut: '⌘+S',
          },
          {
            label: 'Trash',
            icon: 'pi pi-trash',
            shortcut: '⌘+T',
          },
        ],
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-bar',
        shortcut: '⌘+R',
        items: [
          {
            label: 'Sales',
            icon: 'pi pi-chart-line',
            badge: '3',
          },
          {
            label: 'Products',
            icon: 'pi pi-list',
            badge: '6',
            routerLink: '/home/productos',
          },
        ],
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        shortcut: '⌘+W',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            shortcut: '⌘+O',
          },
          {
            label: 'Privacy',
            icon: 'pi pi-shield',
            shortcut: '⌘+P',
          },
        ],
      },
    ];
  }

  handleSidebarHide() {
    console.log('Sidebar hidden');
    this.sidebarService.toggleSidebar();
  }
}
