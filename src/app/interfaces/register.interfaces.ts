// interfaces.ts
export interface User {
  id: number;
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
  fecha_producto: string;
  hora_producto: string;
  stock_producto: number;
  cantidad: number;
}

export interface Registro {
  id_usuario: number;
  fecha_registro: string;
  hora_registro: string;
  observacion: string;
}

export interface DetalleRegistro {
  id_registro: number;
  id_producto: number;
  cantidad: number;
}

export interface Registro_Area {
  id_area: number;
  fecha_registro: string;
  hora_registro: string;
  observacion: string;
}


export interface areas {
  id: number;
  nombre_area: string;
}
export interface detailAreas {
  id_registro_area: number;
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

