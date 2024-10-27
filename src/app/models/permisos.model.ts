
export interface Permisos {
  id: number;
  user_id: number;
  opcion_id: number;
  per_editar: boolean;
  per_ver: boolean;
}
export type MutateOperation = 'create' | 'update';  

// Tipo base para las mutaciones
interface BaseMutation<T extends MutateOperation, P> {
  operation: T;
  attributes: P;
}

// Mutación para crear
export interface CreateMutation extends BaseMutation<'create', Permisos> {}

// Mutación para actualizar
export interface UpdateMutation extends BaseMutation<'update', Omit<Permisos, 'id'>> {
  key: Permisos['id'];
}

// Payloads
export interface PayloadPermissions<T> {
  mutate: T[];
}

export type PayloadPermissionsCreate = PayloadPermissions<CreateMutation>;
export type PayloadPermissionsUpdate = PayloadPermissions<UpdateMutation>;