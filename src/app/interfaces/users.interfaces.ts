export interface User {
  id: number;
  tx_nombre: string;
  tx_cedula: string;
  tx_area: string;
  tx_cargo: string;
  dt_status: number;

}

export interface usersAdmin {
  id: number;
  cedula: string;
  telefono: string;
  nombres: string;
  apellidos: string;
  email: string;
  usuario: string;
  password: string;

}
