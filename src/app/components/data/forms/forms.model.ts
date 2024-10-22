export interface FormField {
    id: string;
    label: string;
    type: 'estado' | 'text' | 'number' | 'date' | 'time' | 'autocomplete';
    controlName: string;
    options?: string; // Nombre de la propiedad que contiene las opciones
    dependsOn?: string; // Campo del que depende (opcional)
  }