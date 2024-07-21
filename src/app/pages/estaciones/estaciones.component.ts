import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';


const PRIME_MODULES = [
  CardModule
];

@Component({
  selector: 'app-estaciones',
  standalone: true,
  imports: [ PRIME_MODULES ],
  templateUrl: './estaciones.component.html',
  styleUrl: './estaciones.component.scss'
})
export default class EstacionesComponent {

}
