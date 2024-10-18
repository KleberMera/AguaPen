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


export const columnsProducts = [
  { field: "codigo_producto", header: "Codigo" },
  { field: "nombre_producto", header: "Nombre del Producto", sortable: true },
  { field: "stock_producto", header: "Stock", sortable: true },
  { field: "estado_producto", header: "Estado" },
];
