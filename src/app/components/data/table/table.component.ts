import { Component, EventEmitter, Output, input, output } from '@angular/core';
import { PRIMENG_MODULES } from './table.imports';
import { CommonModule } from '@angular/common';
import { Column } from '../../../models/auth.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [PRIMENG_MODULES, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  readonly data = input<any[]>([]);
  readonly columns = input<Column[]>([]);
  readonly editable = input.required<boolean>();
  readonly rowsPerPageOptions = input<number[]>([]);
  

  //@Output() onEdit = new EventEmitter<any>();
  onEdit = output<any>();
  onDelete = output<any>();
  
  
  isActive!: boolean;

  editItem(item: any) {
    this.onEdit.emit(item);
  }

  deleteItem(item: any) {
    this.onDelete.emit(item);
  }

  // Verifica si el campo es un campo de estado
  isStatusField(field: string): boolean {
    return field.startsWith('estado',)  || field.startsWith('dt_status',);
  }

  // Devuelve el valor del estado en formato texto
  getStatusValue(value: number): string {
    this.isActive = value === 1;
    return this.isActive ? 'Activo' : 'Inactivo';
  }
  
}
