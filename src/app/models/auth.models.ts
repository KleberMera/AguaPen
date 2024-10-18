export interface Column {
  field: string;
  header: string;
  sortable?: boolean;
}


export interface Auth {
  usuario: string;
  password: string;
}

export interface lsUser {
  id: number;
  nombres: string;
  apellidos: string;
  token: string;
}


export interface lsUserPermissions {
  nombre_modulo: string;
  modulo_id: number;
  nombre_menu: string;
  opcion_id: number;
  opcion_label: string;
  opcion_icon: string;
  opcion_routerLink: string;
  permiso_id: number;
  per_ver: number;
  per_editar: number;
}
