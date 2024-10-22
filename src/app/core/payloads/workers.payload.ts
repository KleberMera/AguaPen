import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PayloadWorkerCreate, PayloadWorkerUpdate } from "../../models/workers.model";



export function WorkerForm(): FormGroup {
  return new FormGroup({
    id: new FormControl(null),
    tx_nombre: new FormControl('', Validators.required),
    tx_cedula: new FormControl('', Validators.required),
    tx_area: new FormControl('', Validators.required),
    tx_cargo: new FormControl('', Validators.required),
    tx_correo: new FormControl('', Validators.email),
    dt_status: new FormControl(1),
    dt_usuario: new FormControl(''),
  });
}


export function createWorkerPayload(workerForm: FormGroup): PayloadWorkerCreate {
  const tx_area = workerForm.get('tx_area')?.value?.value || workerForm.get('tx_area')?.value;
  const tx_cargo = workerForm.get('tx_cargo')?.value?.value || workerForm.get('tx_cargo')?.value
  const formValue = { ...workerForm.value, tx_area, tx_cargo};
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
  const tx_area = workerForm.get('tx_area')?.value?.value || workerForm.get('tx_area')?.value;
  const tx_cargo = workerForm.get('tx_cargo')?.value?.value || workerForm.get('tx_cargo')?.value
  const formValue = { ...workerForm.value, tx_area, tx_cargo};
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