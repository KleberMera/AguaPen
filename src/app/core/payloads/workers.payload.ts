import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PayloadWorkERCreate, PayloadWorkERUpdate } from "../../models/workers.model";



export function WorkERForm(): FormGroup {
  return new FormGroup({
    id: new FormControl(null),
    tx_nombre: new FormControl('', Validators.required),
    tx_cedula: new FormControl('', Validators.required),
    tx_area: new FormControl('', Validators.required),
    tx_cargo: new FormControl('', Validators.required),
    tx_correo: new FormControl(''),
    dt_status: new FormControl(1),
    dt_usuario: new FormControl('', Validators.required),
  });
}


export function createWorkERPayload(workERForm: FormGroup): PayloadWorkERCreate {
  const formValue = { ...workERForm.value };
  const payload: PayloadWorkERCreate = {
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

export function updateWorkERPayload(workERForm: FormGroup): PayloadWorkERUpdate {
  const formValue = { ...workERForm.value };
  const payload: PayloadWorkERUpdate = {
    mutate: [
      {
        operation: 'update', // Es una operación de actualización
        key: workERForm.get('id')?.value, // El id del producto
        attributes: {
          ...formValue, // Copia de los valores del formulario
        },
      },
    ],
  };
  return payload;
}