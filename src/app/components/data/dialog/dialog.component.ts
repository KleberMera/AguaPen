import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PRIMENG_MODULES } from '../table/table.imports';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, PRIMENG_MODULES],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input() dialogVisible = false;
  @Input() dialogTitle!:string;
  @Input() formGroup!: FormGroup;
  @Input() dialogWidth = '25rem';
  @Input() loading = false;

  @Output() save = new EventEmitter<void>();

  onSave() {
    if (this.formGroup.valid) {
      this.save.emit();
    }
  }
}
