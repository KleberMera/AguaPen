import { Component, inject, OnInit } from '@angular/core';

import { LayoutService } from '../../services/gen/layout.service';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenuitemComponent } from '../menuitem/menuitem.component';

import { Subscription, take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PermisosService } from '../../services/services_auth/permisos.service';
import { AuthService } from '../../services/services_auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule,
    MenuModule,
    MenuitemComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [MessageService],
})
export class MenuComponent implements OnInit {
  private srvAuth = inject(AuthService);
  private srvPermisos = inject(PermisosService);
  private messageService = inject(MessageService);
  public userSubscription: Subscription = new Subscription();
  user_id: number = 0;
  model: any[] = [];
  loading: boolean = true;
  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.dataUser();
  }

  dataUser() {
    this.loading = true;
    this.srvAuth.getLoginUser().subscribe((res: any) => {
      if (res) {
        this.user_id = res.data.id;

        this.srvPermisos
          .getListPermisosPorUsuario(this.user_id)
          .subscribe((res: any) => {
            if (res) {
              if (this.user_id === 1) {
                this.initializeMenuAdmin(res.data);
                this.loading = false;
              } else {
                this.initializeMenuAdmin(res.data);
                this.loading = false;
              }
              this.loading = false;
            }
          });

        this.loading = false;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener la información del usuario.',
        });
      }
    });
  }

  initializeMenuUser(permisos: any) {
    this.model = [];

    // Add the Home and Dashboard items first
    this.model.push({
      label: 'Home',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/home/dashboard',
        },
      ],
    });

    const menusMap = new Map<string, any>();

    permisos.forEach((permiso: any) => {
      if (!menusMap.has(permiso.nombre_menu)) {
        menusMap.set(permiso.nombre_menu, {
          label: permiso.nombre_menu,
          items: [],
        });
      }

      const menu = menusMap.get(permiso.nombre_menu);
      menu.items.push({
        label: permiso.opcion_label,
        icon: permiso.opcion_icon,
        routerLink: permiso.opcion_routerLink,
      });
    });

    // Append the rest of the menus after Home
    this.model.push(...Array.from(menusMap.values()));
  }

  initializeMenuAdmin(permisos: any) {
    this.model = [];

    // Add the Home and Dashboard items first
    this.model.push({
      label: 'Home',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/home/dashboard',
        },
      ],
    });

    const modulosMap = new Map<string, any>();

    permisos.forEach((permiso: any) => {
      if (!modulosMap.has(permiso.nombre_modulo)) {
        modulosMap.set(permiso.nombre_modulo, {
          label: permiso.nombre_modulo,
          items: [],
        });
      }

      const modulo = modulosMap.get(permiso.nombre_modulo);
      const menu = modulo.items.find(
        (item: any) => item.label === permiso.nombre_menu
      );

      if (!menu) {
        modulo.items.push({
          label: permiso.nombre_menu,
          items: [],
        });
      }

      const menuIndex = modulo.items.findIndex(
        (item: any) => item.label === permiso.nombre_menu
      );
      modulo.items[menuIndex].items.push({
        label: permiso.opcion_label,
        icon: permiso.opcion_icon,
        routerLink: permiso.opcion_routerLink,
      });
    });

    // Append the rest of the modulos after Home
    this.model.push(...Array.from(modulosMap.values()));
  }
}
