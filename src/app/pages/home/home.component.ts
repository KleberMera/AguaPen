import { Component } from '@angular/core';

import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToolbarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {

}