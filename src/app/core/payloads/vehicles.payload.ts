import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PayloadVehiculoCreate, PayloadVehiculoUpdate } from "../../models/vehicles.model";

export function VehicleForm(): FormGroup {
  return new FormGroup({
    id : new FormControl(null),
    placa : new FormControl('', Validators.required),
    tipo : new FormControl('', Validators.required),
    descripcion : new FormControl('', Validators.required),
    estado : new FormControl(1),
  });
}

export function createVehiclePayload(vehicleForm: FormGroup): PayloadVehiculoCreate {
  const formValue = { ...vehicleForm.value };
  const payload : PayloadVehiculoCreate = {
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

export function updateVehiclePayload(vehicleForm: FormGroup): PayloadVehiculoUpdate {
  const formValue = { ...vehicleForm.value };
  const payload : PayloadVehiculoUpdate = {
    mutate: [
      {
        operation: 'update', // Es una operación de actualización
        key: vehicleForm.get('id')?.value, // El id del producto
        attributes: {
          ...formValue, // Copia de los valores del formulario
        },
      },
    ],
  };
  return payload;
}