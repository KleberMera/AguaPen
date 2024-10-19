export interface Vehiculo {
  id: number;
  placa : string;
  tipo : string;
  descripcion : string;
  estado : number;
}

export const columnsVehiculos = [
  { field: "placa", header: "Placa" },
  { field: "tipo", header: "Tipo" },
  { field: "descripcion", header: "Descripción" },
  { field: "estado", header: "Estado" },
];