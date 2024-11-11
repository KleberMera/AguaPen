import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { RegisterComponent } from './components/register/register.component';
import { UpdatedComponent } from './components/updated/updated.component';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TabViewModule, RegisterComponent, UpdatedComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export default class UsersComponent {

}
