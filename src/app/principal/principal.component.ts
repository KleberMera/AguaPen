import { Component } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

  listaUsuarios: any[] = [];

  constructor(private authService: AuthService) {
    this.authService.verUsuarios().subscribe((res : any) => {
      console.log(res.data);
      this.listaUsuarios = res.data;
    });

   }

  logout(): void {
    this.authService.logout();
   
  }
}
