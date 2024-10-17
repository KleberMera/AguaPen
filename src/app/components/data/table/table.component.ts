import { Component, Input, TemplateRef } from '@angular/core';
import { PRIMENG_MODULES } from './table.imports';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [PRIMENG_MODULES, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() rows: number = 20;
}
