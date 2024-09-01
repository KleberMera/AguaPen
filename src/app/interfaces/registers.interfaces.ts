export interface Registro {
  id_usuario: number;
  id_user_registro: number;
  fecha_registro: string;
  hora_registro: string;
  observacion: string;
  estado_registro: number;
}

export interface registerArea {
  id_area: number;
  id_user_registro: number;
  fecha_registro: string;
  hora_registro: string;
  observacion: string;
  estado_registro: number;
}


export interface registerVehiculos {
  id_vehiculo: number;
  id_user_registro: number;
  fecha_registro: string;
  hora_registro: string;
  observacion: string;
  estado_registro: number;
}
