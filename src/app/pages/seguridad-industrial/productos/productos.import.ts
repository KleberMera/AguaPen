
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormControl, FormGroup, Validators } from '@angular/forms';
export const PRIMENG_MODULES = [
  FieldsetModule,
  TableModule,
  CardModule,
  ButtonModule,
  ProgressSpinnerModule,
  DialogModule,
  ToastModule,
  ConfirmDialogModule,
  InputTextModule,
  AutoCompleteModule,
  InputGroupModule,
  InputGroupAddonModule,
  IconFieldModule,
  InputIconModule,
  RippleModule,
  TagModule,
  InputSwitchModule
];



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