import { Component, input, Input } from '@angular/core';
import { UserAttributes } from '../../../../../models/users.model';

@Component({
  selector: 'app-panel-assing',
  standalone: true,
  imports: [],
  templateUrl: './panel-assing.component.html',
  styleUrl: './panel-assing.component.scss'
})
export class PanelAssingComponent {
 user = input.required<UserAttributes | null>();
 key = input<string | number>(); // Input para la key

}
