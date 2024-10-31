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