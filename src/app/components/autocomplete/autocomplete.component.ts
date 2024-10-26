import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AutocompleteConfig } from './autocomple.model';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [AutoCompleteModule, FormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss'
})
export class AutocompleteComponent<T> {
  @Input() placeholder! : string;
  @Input() items = signal<T[]>([]);
  @Input() config!: AutocompleteConfig<T>;
  @Output() itemSelected = new EventEmitter<T>();

  selectedItem = signal<T | null>(null);
  filteredItems = signal<T[]>([]);

  filterItems(event: { query: string }) {
    const filteredResults = this.config.filterFn(event.query, this.items());
    this.filteredItems.set(filteredResults);
  }

  onItemSelect() {
    const selected = this.selectedItem();
    if (selected) {
      this.itemSelected.emit(selected);
    }
  }

  clear() {
    this.selectedItem.set(null);
  }

}
