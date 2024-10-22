import { FormField } from "../components/data/forms/forms.model";

export interface Product {
  id: number;
  codigo_producto: string;
  nombre_producto: string;
  fecha_producto: string;
  hora_producto: string;
  stock_producto: number;
  cantidad: number;
  estado_producto: number;
}

// Tipo base para las operaciones de mutación
export type MutateOperation = 'create' | 'update';

// Tipo base para las mutaciones
interface BaseMutation<T extends MutateOperation, P> {
  operation: T;
  attributes: P;
}

// Mutación para crear
export interface CreateMutation extends BaseMutation<'create', Product> {}

// Mutación para actualizar
export interface UpdateMutation extends BaseMutation<'update', Omit<Product, 'id'>> {
  key: Product['id'];
}

// Payloads
export interface PayloadProduct<T> {
  mutate: T[];
}

export type PayloadProductCreate = PayloadProduct<CreateMutation>;
export type PayloadProductUpdate = PayloadProduct<UpdateMutation>;

export const columnsProducts = [
  { field: "codigo_producto", header: "Codigo" },
  { field: "nombre_producto", header: "Nombre del Producto", sortable: true },
  { field: "stock_producto", header: "Stock", sortable: true },
  { field: "estado_producto", header: "Estado" },
];

export const fieldsFormsProducts : FormField[]= [
  { id: 'estado_producto', label: 'Estado', type: 'estado', controlName: 'estado_producto' },
  { id: 'codigo_producto', label: 'Código', type: 'text', controlName: 'codigo_producto' },
  { id: 'nombre_producto', label: 'Nombre', type: 'text', controlName: 'nombre_producto' },
  { id: 'fecha_producto', label: 'Fecha', type: 'date', controlName: 'fecha_producto' },
  { id: 'hora_producto', label: 'Hora', type: 'time', controlName: 'hora_producto' },
  { id: 'stock_producto', label: 'Stock', type: 'number', controlName: 'stock_producto' },
];