import { FormField } from "../components/data/forms/forms.model";

export interface UserAttributes {
  id: number;
  cedula: string;
  telefono: string;
  nombres: string;
  apellidos: string;
  email: string;
  usuario: string;
  password: string;
  estado: number;
  email_verified_at?: string;
  remember_token?: string;
  created_at?: string;
  updated_at?: string;
}


export interface viewDataUser {
  data: UserAttributes;
}

// Tipo base para las operaciones de mutación
export type MutateOperation = 'create' | 'update';

// Tipo base para las mutaciones
interface BaseMutation<T extends MutateOperation, P> {
  operation: T;
  attributes: P;
}


// Mutación para crear
export interface CreateMutation extends BaseMutation<'create', UserAttributes> {}

// Mutación para actualizar
export interface UpdateMutation extends BaseMutation<'update', Omit<UserAttributes, 'id'>> {
  key: UserAttributes['id'];
}

// Payloads
export interface PayloadUser<T> {
  mutate: T[];
}

export type PayloadUserCreate = PayloadUser<CreateMutation>;
export type PayloadUserUpdate = PayloadUser<UpdateMutation>;


export const columnsUsers = [
  { field: 'id', header: 'Nº' },
  { field: 'cedula', header: 'Cédula' },
  { field: 'telefono', header: 'Telefono' },
  { field: 'nombres', header: 'Nombre' },
  { field: 'apellidos', header: 'Apellidos' },
  { field: 'email', header: 'Email' },
  { field: 'usuario', header: 'Usuario' },
  { field: 'password', header: 'Contraseña' },
  { field: 'estado', header: 'Estado' },
];

export const fieldsFormsUsers: FormField[] = [
  { id: 'cedula', label: 'Cédula', type: 'text', controlName: 'cedula' },
  { id: 'telefono', label: 'Telefono', type: 'text', controlName: 'telefono' },
  { id: 'nombres', label: 'Nombre', type: 'text', controlName: 'nombres' },
  { id: 'apellidos', label: 'Apellidos', type: 'text', controlName: 'apellidos' },
  { id: 'email', label: 'Email', type: 'text', controlName: 'email' },
  { id: 'usuario', label: 'Usuario', type: 'text', controlName: 'usuario' },
  { id: 'password', label: 'Contraseña', type: 'text', controlName: 'password' },
  { id: 'estado', label: 'Estado', type: 'estado', controlName: 'estado' },
];