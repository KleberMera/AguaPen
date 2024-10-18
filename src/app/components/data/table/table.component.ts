import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PRIMENG_MODULES } from './table.imports';
import { CommonModule } from '@angular/common';
import { Column } from '../../../models/auth.models';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [PRIMENG_MODULES, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: Column[] = [];
  @Input() editable!: boolean;
  @Input() rowsPerPageOptions: number[] = [];
  

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  isActive!: boolean;

  editItem(item: any) {
    this.onEdit.emit(item);
  }

  deleteItem(item: any) {
    this.onDelete.emit(item);
  }

  // Verifica si el campo es un campo de estado
  isStatusField(field: string): boolean {
    return field.startsWith('estado'); // Detecta cualquier campo que empiece por "estado"
  }

  // Devuelve el valor del estado en formato texto
  getStatusValue(value: number): string {
    this.isActive = value === 1;
    return this.isActive ? 'Activo' : 'Inactivo';
  }
  
}
