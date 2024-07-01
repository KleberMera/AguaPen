import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent implements OnInit {

  nombres: string = '';
  
  //injector
  private srvAuth = inject(AuthService);
  
  ngOnInit(): void {


    const usuarioLogueado = localStorage.getItem('userLogin');
    if (usuarioLogueado) {
      const nombreUser = JSON.parse(usuarioLogueado);
      this.nombres = nombreUser.nombres;
    }
      
    

    
 
  }

}
