import { FormField } from "../components/data/forms/forms.model";

export interface Worker {
  id: number;
  tx_nombre: string;
  tx_cedula: string;
  tx_area: string;
  tx_cargo: string;
  tx_correo: string;
  dt_status: number;
  dt_usuario: string;
}

export type MutateOperation = 'create' | 'update';  

// Tipo base para las mutaciones
interface BaseMutation<T extends MutateOperation, P> {
  operation: T;
  attributes: P;
}

// Mutación para crear
export interface CreateMutation extends BaseMutation<'create', Worker> {}

// Mutación para actualizar
export interface UpdateMutation extends BaseMutation<'update', Omit<Worker, 'id'>> {
  key: Worker['id'];
}

// Payloads
export interface PayloadWorkER<T> {
  mutate: T[];
}

export type PayloadWorkerCreate = PayloadWorkER<CreateMutation>;
export type PayloadWorkerUpdate = PayloadWorkER<UpdateMutation>;

export const columnsWorker = [
  { field: 'id', header: 'Nº' },
  { field: 'tx_nombre', header: 'Nombre' },
  { field: 'tx_cedula', header: 'Cédula' },
  { field: 'tx_area', header: 'Área' },
  { field: 'tx_cargo', header: 'Cargo' },
  { field: 'dt_status', header: 'Estado' },
];

export const fieldsFormsWorker: FormField[] = [
  { id: 'dt_status', label: 'Estado', type: 'estado', controlName: 'dt_status' },
  { id: 'dt_usuario', label: 'Usuario', type: 'text', controlName: 'dt_usuario' },
  { id: 'tx_nombre', label: 'Nombre', type: 'text', controlName: 'tx_nombre' },
  { id: 'tx_cedula', label: 'Cédula', type: 'text', controlName: 'tx_cedula' },
  { id: 'tx_area', label: 'Área', type: 'autocomplete', controlName: 'tx_area', options: 'areaOptions' },
  { id: 'tx_cargo', label: 'Cargo', type: 'autocomplete', controlName: 'tx_cargo', options: 'cargoOptions' },
  { id: 'tx_correo', label: 'Correo', type: 'text', controlName: 'tx_correo'},
];
