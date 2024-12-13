import { Component, EventEmitter, Output, input } from '@angular/core';
import { PRIMENG_MODULES } from '../table/table.imports';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [PRIMENG_MODULES, FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  readonly placeholder = input.required<string>(); // You can customize the placeholder
  @Output() searchChange = new EventEmitter<string>(); // Emits search input changes
  @Output() onAdd = new EventEmitter<void>();
  readonly editable = input<boolean>(false);
  searchTerm: string = '';
  @Output() onSearch = new EventEmitter<string>();
  onSearchChange() {
    this.searchChange.emit(this.searchTerm); // Emit the search term to the parent component
  }

  handleAdd() {
    this.onAdd.emit();
  }

  handleSearch() {
    this.onSearch.emit(this.searchTerm);
  }
}
