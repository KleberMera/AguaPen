export interface User {
    id: number;
    tx_nombre: string;
    tx_cedula: string;
    tx_area: string;
    tx_cargo: string;
    tx_vehiculo?: string;
    tx_vehiculo_descripcion?: string;
  }
  

  export interface usersAdmin {
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
  