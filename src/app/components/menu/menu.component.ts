import { Component, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [PanelMenuModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  items: MenuItem[] = [];


  ngOnInit(): void {
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
  }



