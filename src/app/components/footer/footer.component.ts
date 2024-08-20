import { Component } from '@angular/core';
import { LayoutService } from '../../services/gen/layout.service';
import { AvatarModule } from 'primeng/avatar';

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
