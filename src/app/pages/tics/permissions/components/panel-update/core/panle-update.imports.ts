// shared-imports.ts
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Ripple } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AvatarModule } from 'primeng/avatar';
import { lsUserPermissions } from '../../../../../../models/auth.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

export const SHARED_IMPORTS = [
  TableModule,
  ButtonModule,
  TagModule,
  Ripple,
  ConfirmDialogModule,
  AvatarModule,
  ProgressSpinnerModule
];


export function groupModulesByName(modules: lsUserPermissions[]) {
  const modulesMap = new Map<
    string,
    {
      nombre_modulo: string;
      menus: Map<string, { nombre_menu: string; opciones: lsUserPermissions[] }>;
    }
  >();

  modules.forEach((item) => {
    if (!modulesMap.has(item.nombre_modulo)) {
      modulesMap.set(item.nombre_modulo, {
        nombre_modulo: item.nombre_modulo,
        menus: new Map(),
      });
    }
    const module = modulesMap.get(item.nombre_modulo)!;

    if (!module.menus.has(item.nombre_menu)) {
      module.menus.set(item.nombre_menu, {
        nombre_menu: item.nombre_menu,
        opciones: [],
      });
    }
    const menu = module.menus.get(item.nombre_menu)!;
    menu.opciones.push(item);
  });

  return Array.from(modulesMap.values()).map((module) => ({
    nombre_modulo: module.nombre_modulo,
    menus: Array.from(module.menus.values()),
  }));
}
