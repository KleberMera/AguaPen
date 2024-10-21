export interface WorkER {
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
export interface CreateMutation extends BaseMutation<'create', WorkER> {}

// Mutación para actualizar
export interface UpdateMutation extends BaseMutation<'update', Omit<WorkER, 'id'>> {
  key: WorkER['id'];
}

// Payloads
export interface PayloadWorkER<T> {
  mutate: T[];
}

export type PayloadWorkERCreate = PayloadWorkER<CreateMutation>;
export type PayloadWorkERUpdate = PayloadWorkER<UpdateMutation>;

export const columnsWorkER = [
  { field: 'tx_nombre', header: 'Nombre' },
  { field: 'tx_cedula', header: 'Cédula' },
  { field: 'tx_area', header: 'Área' },
  { field: 'tx_cargo', header: 'Cargo' },
  { field: 'tx_correo', header: 'Correo' },
  { field: 'dt_status', header: 'Estado' },
];

export const fieldsFormsWorkER = [
  { id: 'dt_status', label: 'Estado', type: 'estado', controlName: 'dt_status' },
  { id: 'tx_nombre', label: 'Nombre', type: 'text', controlName: 'tx_nombre' },
  { id: 'tx_cedula', label: 'Cédula', type: 'text', controlName: 'tx_cedula' },
  { id: 'tx_area', label: 'Área', type: 'text', controlName: 'tx_area' },
  { id: 'tx_cargo', label: 'Cargo', type: 'text', controlName: 'tx_cargo' },
  { id: 'tx_correo', label: 'Correo', type: 'text', controlName: 'tx_correo' },
];
