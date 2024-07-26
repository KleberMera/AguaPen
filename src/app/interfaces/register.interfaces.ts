// interfaces.ts
export interface User {
  id_usuario: number;
  tx_nombre: string;
  tx_cedula: string;
  tx_area: string;
  tx_cargo: string;
  tx_vehiculo?: string;
  tx_vehiculo_descripcion?: string;
}

export interface Product {
  id: number;
  nombre_producto: string;
  stock_producto: number;
  cantidad: number;
}

export interface Registro {
  id_usuario: number;
  observacion: string;
}

export interface DetalleRegistro {
  id_registro: number;
  id_producto: number;
  cantidad: number;
}

export interface Registro_Area {
  id_area: number;
  observacion: string;
}


export interface AREAS {
  id: number;
  nombre_area: string;
}
export interface DetalleRegistrode_AREA {
  id_registro_a: number;
  id_producto: number;
  cantidad: number;
}


export interface usuariologin  {
  id: number;
  cedula: string;
  telefono: string;
  nombres: string;
  apellidos: string;
  correo: string;
  usuario: string;
  clave: string;
  rol_id: number;
}

