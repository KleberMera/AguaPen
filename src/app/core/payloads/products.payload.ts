import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PayloadProductCreate, PayloadProductUpdate } from "../../models/products.model";

export function ProductForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(null), // ID del producto, opcional si es un nuevo producto
      codigo_producto: new FormControl({ value: '', disabled: true }), // Deshabilitado por defecto
      nombre_producto: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      fecha_producto: new FormControl('', Validators.required),
      hora_producto: new FormControl('', Validators.required),
      stock_producto: new FormControl(0, [
        Validators.required,
        Validators.min(0),
      ]),
      estado_producto: new FormControl(1),
    });
  }
  
  export function createProductPayload(productForm: FormGroup): PayloadProductCreate {
    const formValue = { ...productForm.value };
    const payload : PayloadProductCreate = {
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
  
  
  export function updateProductPayload(productForm: FormGroup): PayloadProductUpdate {
    const formValue = { ...productForm.value };
    const payload : PayloadProductUpdate = {
      mutate: [
        {
          operation: 'update', // Es una operación de actualización
          key: productForm.get('id')?.value, // El id del producto
          attributes: {
            ...formValue, // Copia de los valores del formulario
          },
        },
      ],
    };
    return payload;
  }