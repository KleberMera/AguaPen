import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenuitemComponent } from '../menuitem/menuitem.component';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LayoutService } from '../../../services/gen/layout.service';
import { AuthService } from '../../../services/auth/auth.service';
import { PermisosService } from '../../../services/auth/permisos.service';
import { MenuItem, Permiso } from './menu.models';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ MenuComponent, FormsModule, MenuModule, MenuitemComponent, ProgressSpinnerModule,
    SkeletonModule, MessageModule ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [MessageService],
})
export class MenuComponent{
  private readonly authService = inject(AuthService);
  private readonly permisosService = inject(PermisosService);
  protected userId = signal<number>(0);
  protected model = signal<MenuItem[]>([]);
  protected loading = signal(true);

  // Base menu that's always present
  private readonly baseMenu: MenuItem[] = [
    {
      label: 'Home',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/home/dashboard'
        }
      ]
    }
  ];

  constructor() {
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      const userData = await this.authService.getLoginUser().toPromise();
      
      if (userData?.data) {
        this.userId.set(userData.data.id); 
        const permisos = await this.permisosService.getListPermisosPorUsuario(this.userId()).toPromise();
        if (permisos?.data) {
          this.initializeMenu(permisos.data);
        }
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private initializeMenu(permisos: Permiso[]): void {
    const menuItems = permisos.reduce((acc: Record<string, MenuItem>, permiso: Permiso) => {
      // Create or get module
      if (!acc[permiso.nombre_modulo]) {
        acc[permiso.nombre_modulo] = {
          label: permiso.nombre_modulo,
          items: []
        };
      }

      // Find or create menu within module
      const moduleMenu = acc[permiso.nombre_modulo];
      let menu = moduleMenu.items?.find(item => item.label === permiso.nombre_menu);
      
      if (!menu) {
        menu = { label: permiso.nombre_menu, items: [] };
        moduleMenu.items?.push(menu);
      }

      // Add menu option
      menu.items?.push({
        label: permiso.opcion_label,
        icon: permiso.opcion_icon,
        routerLink: permiso.opcion_routerLink
      });

      return acc;
    }, {});

    // Update model with base menu and generated items
    this.model.set([
      ...this.baseMenu,
      ...Object.values(menuItems)
    ]);
  }
}
