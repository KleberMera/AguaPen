export interface User {
  id: number;
  tx_nombre: string;
  tx_cedula: string;
  tx_area: string;
  tx_cargo: string;
  tx_correo: string;
  dt_status: number;
  dt_usuario: string;
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
  estado: number;
}

export interface UserAttributes {
  id: number;
  cedula: string;
  telefono: string;
  nombres: string;
  apellidos: string;
  email: string;
  usuario: string;
  password: string;
  estado: string;
}

export interface viewDataUser {
  data: UserAttributes;
}

// Define el tipo para las operaciones permitidas
export type OperationType = 'create' | 'update';

// Cambia el operation para que sea siempre 'create'
export interface MutateOperation {
  operation: 'update'; // operation es siempre 'create'
  key: UserAttributes['id']; // El id de UserAttributes
  attributes: Omit<UserAttributes, 'id'>; // Omitimos el id de los atributos
}

export interface MutatePayload {
  mutate: MutateOperation[];
}
