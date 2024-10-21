import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
interface DisplayInfo {
  label: string;
  initials: string;
  secondary?: string;
}
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [DropdownModule, FormsModule, CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent<T> {
  @Input() items: T[] = [];
  @Input() placeholder = 'Seleccionar';
  @Input() disabled = false;
  @Input() optionLabel = '';
  @Input() filterBy = '';
  @Input() showClear = true;
  @Input() itemTemplate?: TemplateRef<any>;
  @Input() secondaryLabel = '';
  @Input() styleClass = '';
  @Input() showInitials = false; // New input to control initials display
  
  @Output() itemSelected = new EventEmitter<T>();
  @Output() cleared = new EventEmitter<void>();
  
  selectedItem: T | null = null;

  onSelect(event: { value: T }): void {
    if (event.value) {
      this.selectedItem = event.value;
      this.itemSelected.emit(event.value);
    }
  }

  onClear(): void {
    this.selectedItem = null;
    this.cleared.emit();
  }

  private getPropertyValue(item: any, property: string): any {
    return property.split('.').reduce((obj, key) => obj?.[key], item);
  }

  getDisplayInfo(item: any): DisplayInfo {
    const label = this.getPropertyValue(item, this.optionLabel);
    const words = label.split(' ');
    const initials = words.map((word: string) => word.charAt(0).toUpperCase()).join('');
    
    return {
      label,
      initials: initials.substring(0, 2), // Limitamos a 2 caracteres
      secondary: this.secondaryLabel ? this.getPropertyValue(item, this.secondaryLabel) : undefined
    };
  }
}
