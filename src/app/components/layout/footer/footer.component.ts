import { Component } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';
import { LayoutService } from '../../../services/gen/layout.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ AvatarModule ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(public layoutService: LayoutService) { }

}
