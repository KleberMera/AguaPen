import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CardModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent implements OnInit {
  nombres: string | null = '';
  usuario_id: string | null = '';
  apellidos: string | null = '';

  //injector
  private srvAuth = inject(AuthService);

  ngOnInit(): void {


    this.srvAuth.nombres$.subscribe((nombres) => {
      this.nombres = nombres;
    });

    this.srvAuth.usuarioId$.subscribe((usuario_id) => {
      this.usuario_id = usuario_id;
    });

    this.srvAuth.apellidos$.subscribe((apellidos) => {
      this.apellidos = apellidos;
    });

    console.log('Nombre del usuario:', this.nombres);
    console.log('ID del usuario:', this.usuario_id);
    console.log('Apellidos del usuario:', this.apellidos);
  }
}
