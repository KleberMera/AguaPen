export interface Area {
  id: number;
  nombre_area: string;
  estado: number;
}

 export type MutateOperation = 'create' | 'update';

 interface BaseMutation<T extends MutateOperation, P> {
   operation: T;
   attributes: P;
 }

 // Mutación para crear
 export interface CreateMutation extends BaseMutation<'create', Area> {}

 // Mutación para actualizar
 export interface UpdateMutation extends BaseMutation<'update', Omit<Area, 'id'>> {
   key: Area['id'];
 }

 // Payloads
 export interface PayloadArea<T> {
   mutate: T[];
 }

 export type PayloadAreaCreate = PayloadArea<CreateMutation>;
 export type PayloadAreaUpdate = PayloadArea<UpdateMutation>;

 export const columnsAreas = [
   { field: "nombre_area", header: "Nombre Area" },
   { field: "estado", header: "Estado" },
 ];

 export const fieldsFormsAreas = [
   { id: 'estado', label: 'Estado', type: 'estado', controlName: 'estado' },
   { id: 'nombre_area', label: 'Nombre Area', type: 'text', controlName: 'nombre_area' },
 ];