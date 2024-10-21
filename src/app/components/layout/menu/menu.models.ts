// models/menu.interfaces.ts
export interface Permiso {
  nombre_modulo: string;
  nombre_menu: string;
  opcion_label: string;
  opcion_icon: string;
  opcion_routerLink: string;
}

// models/menu.interfaces.ts
export interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string;
  items?: MenuItem[];
  separator?: boolean;  // Añadir esta línea
}
