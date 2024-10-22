import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PayloadWorkerCreate, PayloadWorkerUpdate } from "../../models/workers.model";



export function WorkerForm(): FormGroup {
  return new FormGroup({
    id: new FormControl(null),
    tx_nombre: new FormControl('', Validators.required),
    tx_cedula: new FormControl('', Validators.required),
    tx_area: new FormControl('', Validators.required),
    tx_cargo: new FormControl('', Validators.required),
    tx_correo: new FormControl(''),
    dt_status: new FormControl(1),
    dt_usuario: new FormControl(''),
  });
}


export function createWorkerPayload(workerForm: FormGroup): PayloadWorkerCreate {
  const formValue = { ...workerForm.value };
  const payload: PayloadWorkerCreate = {
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

export function updateWorkerPayload(workerForm: FormGroup): PayloadWorkerUpdate {
  const formValue = { ...workerForm.value };
  const payload: PayloadWorkerUpdate = {
    mutate: [
      {
        operation: 'update', // Es una operación de actualización
        key: workerForm.get('id')?.value, // El id del producto
        attributes: {
          ...formValue, // Copia de los valores del formulario
        },
      },
    ],
  };
  return payload;
}