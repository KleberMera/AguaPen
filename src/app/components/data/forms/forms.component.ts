import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PRIMENG_MODULES } from '../table/table.imports';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField } from './forms.model';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [PRIMENG_MODULES, CommonModule, ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields: FormField[] = [];
  @Input() loading: boolean = false;
  @Input() options: { [key: string]: any[] } = {}; // Objeto con todas las opciones disponibles

  @Output() formSubmit = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  filteredOptions: { [key: string]: any[] } = {};

  toggleEstado(controlName: string) {
    const currentValue = this.formGroup.get(controlName)?.value;
    this.formGroup.patchValue({
      [controlName]: currentValue ? 0 : 1,
    });
  }

  filterOptions(event: any, field: FormField) {
    if (!field.options || !this.options[field.options]) return;
    
    const query = event.query.toLowerCase();
    const availableOptions = this.options[field.options];
    
    this.filteredOptions[field.controlName] = availableOptions.filter(option =>
      option.label.toLowerCase().includes(query)
    );

    // Si el campo tiene dependencias
    if (field.dependsOn) {
      const parentValue = this.formGroup.get(field.dependsOn)?.value;
      if (parentValue) {
        this.filteredOptions[field.controlName] = this.filteredOptions[field.controlName]
          .filter(option => option.parentValue === parentValue);
      }
    }
  }
}
