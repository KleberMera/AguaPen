import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PayloadUserCreate, PayloadUserUpdate } from '../../models/users.model';

export function UserForm(): FormGroup {
  return new FormGroup({
    id: new FormControl(null), // ID del producto, opcional si es un nuevo producto
    cedula: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    telefono: new FormControl('', Validators.required),
    nombres: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    apellidos: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    usuario: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    estado: new FormControl(1),
  });
}

export function createUserPayload(userForm: FormGroup): PayloadUserCreate {
  const formValue = { ...userForm.value };
  const payload: PayloadUserCreate = {
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

export function updateUserPayload(userForm: FormGroup): PayloadUserUpdate {
  const formValue = { ...userForm.value };
  const payload: PayloadUserUpdate = {
    mutate: [
      {
        operation: 'update', // Es una operación de actualización
        key: userForm.get('id')?.value, // El id del producto
        attributes: {
          ...formValue, // Copia de los valores del formulario
        },
      },
    ],
  };
  return payload;
}
