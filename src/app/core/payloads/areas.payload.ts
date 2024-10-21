import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PayloadAreaCreate, PayloadAreaUpdate } from "../../models/areas.model";



export function AreaForm(): FormGroup {
  return new FormGroup({
    id : new FormControl(null),
    nombre_area : new FormControl('', Validators.required),
    estado : new FormControl(1),
  });
}

export function createAreaPayload(areaForm: FormGroup): PayloadAreaCreate {
  const formValue = { ...areaForm.value };
  const payload : PayloadAreaCreate = {
    mutate: [
      {
        operation: 'create', // Es una operación de creación
        attributes: {
          ...formValue, // Copia de los valores del formulario
        },
      },
    ],
  };
  return payload;
}

export function updateAreaPayload(areaForm: FormGroup): PayloadAreaUpdate {
  const formValue = { ...areaForm.value };
  const payload : PayloadAreaUpdate = {
    mutate: [
      {
        operation: 'update', // Es una operación de actualización
        key: areaForm.get('id')?.value, // El id del producto
        attributes: {
          ...formValue, // Copia de los valores del formulario
        },
      },
    ],
  };
  return payload;
}