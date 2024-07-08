export interface InterfaceRegistro {
    id_registro?: number; // El ID podría ser opcional si se asigna automáticamente en la base de datos
    id_usuario: number;
    fecha_registro: string; // Considerando que la fecha se almacena como string en formato adecuado (ej. 'YYYY-MM-DD')
    hora_registro: string; // Hora en formato adecuado (ej. 'HH:MM:SS')
    observacion: string;
    detalles: InterfaceDetalleRegistro[];
  }
  
  export interface InterfaceDetalleRegistro {
    id_producto: number;
    cantidad: number;
  }
  