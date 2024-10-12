export interface Auth {
  usuario: string;
  password: string;
}

export interface Root {
  usuario: Usuario;
  token: string;
}

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
}
