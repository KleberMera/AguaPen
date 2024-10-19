import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PRIMENG_MODULES } from '../table/table.imports';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [PRIMENG_MODULES, CommonModule, ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {
  @Input() formGroup!: FormGroup; // El formulario que se pasa desde el padre
  @Input() fields: any[] = []; // Campos y su configuración
  @Input() loading: boolean = false; // Estado de carga

  @Output() formSubmit = new EventEmitter<void>(); // Emitir cuando el formulario se envía
  @Output() formCancel = new EventEmitter<void>(); // Emitir cuando el formulario se cancela

  toggleEstado(controlName: string) {
    const currentValue = this.formGroup.get(controlName)?.value;
    this.formGroup.patchValue({
      [controlName]: currentValue ? 0 : 1,
    });
  }
}
