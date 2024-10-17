export interface Auth {
  usuario: string;
  password: string;
}

export interface localStorageUser {
  id: number;
  nombres: string;
  apellidos: string;
  token: string;
}


export interface LsUserPermissions {
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
