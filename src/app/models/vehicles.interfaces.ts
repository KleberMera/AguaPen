export interface Vehiculo {
  id: number;
  placa : string;
  tipo : string;
  descripcion : string;
  estado : number;
}


// Tipo base para las operaciones de mutación
export type MutateOperation = 'create' | 'update';

// Tipo base para las mutaciones
interface BaseMutation<T extends MutateOperation, P> {
  operation: T;
  attributes: P;
}

// Mutación para crear
export interface CreateMutation extends BaseMutation<'create', Vehiculo> {}

// Mutación para actualizar
export interface UpdateMutation extends BaseMutation<'update', Omit<Vehiculo, 'id'>> {
  key: Vehiculo['id'];
}

// Payloads
export interface PayloadVehiculo<T> {
  mutate: T[];
}

export type PayloadVehiculoCreate = PayloadVehiculo<CreateMutation>;
export type PayloadVehiculoUpdate = PayloadVehiculo<UpdateMutation>;

export const columnsVehiculos = [
  { field: "placa", header: "Placa" },
  { field: "tipo", header: "Tipo" },
  { field: "descripcion", header: "Descripción" },
  { field: "estado", header: "Estado" },
];

export const fieldsFormsVehiculos = [
  { id: 'estado', label: 'Estado', type: 'estado', controlName: 'estado' },
  { id: 'placa', label: 'Placa', type: 'text', controlName: 'placa' },
  { id: 'tipo', label: 'Tipo', type: 'text', controlName: 'tipo' },
  { id: 'descripcion', label: 'Descripción', type: 'text', controlName: 'descripcion' },
];