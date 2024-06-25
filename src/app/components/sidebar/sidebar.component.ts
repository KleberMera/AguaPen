import { Component, OnInit, computed, inject } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';

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
  imports: [PRIMEMG_MODULES],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  sidebarVisible: boolean = true;

  items: MenuItem[] = [];

  ngOnInit() {
      this.items = [
          {
              label: 'Mail',
              icon: 'pi pi-envelope',
              badge: '5',
              items: [
                  {
                      label: 'Compose',
                      icon: 'pi pi-file-edit',
                      shortcut: '⌘+N'
                  },
                  {
                      label: 'Inbox',
                      icon: 'pi pi-inbox',
                      badge: '5'
                  },
                  {
                      label: 'Sent',
                      icon: 'pi pi-send',
                      shortcut: '⌘+S'
                  },
                  {
                      label: 'Trash',
                      icon: 'pi pi-trash',
                      shortcut: '⌘+T'
                  }
              ]
          },
          {
              label: 'Reports',
              icon: 'pi pi-chart-bar',
              shortcut: '⌘+R',
              items: [
                  {
                      label: 'Sales',
                      icon: 'pi pi-chart-line',
                      badge: '3'
                  },
                  {
                      label: 'Products',
                      icon: 'pi pi-list',
                      badge: '6',
                      routerLink: '/home/productos'
                  }
              ]
          },
          {
              label: 'Profile',
              icon: 'pi pi-user',
              shortcut: '⌘+W',
              items: [
                  {
                      label: 'Settings',
                      icon: 'pi pi-cog',
                      shortcut: '⌘+O'
                  },
                  {
                      label: 'Privacy',
                      icon: 'pi pi-shield',
                      shortcut: '⌘+P'
                  }
              ]
          }
      ];
  }

  toggleAll() {
      const expanded = !this.areAllItemsExpanded();
      this.items = this.toggleAllRecursive(this.items, expanded);
  }

  private toggleAllRecursive(items: MenuItem[], expanded: boolean): MenuItem[] {
      return items.map((menuItem) => {
          menuItem.expanded = expanded;
          if (menuItem.items) {
              menuItem.items = this.toggleAllRecursive(menuItem.items, expanded);
          }
          return menuItem;
      });
  }

  private areAllItemsExpanded(): boolean {
      return this.items.every((menuItem) => menuItem.expanded);
  }
}
