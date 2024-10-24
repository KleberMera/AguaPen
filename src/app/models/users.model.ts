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
}


export interface viewDataUser {
  data: UserAttributes;
}

export interface MutateOperationUpdate {
  operation: 'update';
  key: UserAttributes['id'];
  attributes: Omit<UserAttributes, 'id'>;
}

export interface MutateOperationCreate {
  operation: 'create';
  attributes: UserAttributes;
}

export interface MutatePayloadUpdate {
  mutate: MutateOperationUpdate[];
}

export interface MutatePayloadCreate {
  mutate: MutateOperationCreate[];
}
