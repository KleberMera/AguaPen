import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
const PRIMENG_MODULES = [CardModule, ButtonModule, SplitButtonModule, ToastModule, RippleModule];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PRIMENG_MODULES],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [MessageService],
})
export default class DashboardComponent implements OnInit {
  nombres: string | null = '';
  usuario_id: string | null = '';
  apellidos: string | null = '';

  totalProductos: string = '';
  listUsuarios: any = [];
  totalUsuarios: string = '';
  listAreas: any = [];
  totalAreas: string = '';
  listRegistros: any = [];
  totalRegistros: string = '';
  items: MenuItem[] = [];
  //injector
  private srvAuth = inject(AuthService);
  private router = inject(Router);
  private srvList = inject(ListService);
  private srvMessage = inject(MessageService);

  ngOnInit(): void {
    this.items = [
      {
          label: 'Ver',
          command: () => {
              this.update();
          }
      },
      {
          label: 'Registrar',
          command: () => {
              this.delete();
          }
      },

      { label: 'Upload', routerLink: ['/home/productos'] },
  ];
    this.getListProductos();
    this.getListUsuarios();
    this.getListAreas();
    this.getListRegistros();
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

  navigateTo(event: Event) {
    this.router.navigate(['/home/registros']);
  }

  async getListProductos() {
    const res = await this.srvList.getListProductos().toPromise();

    this.totalProductos = res.total;
  }

  async getListUsuarios() {
    const res = await this.srvList.getListUsuarios().toPromise();

    this.totalUsuarios = res.total;
  }

  async getListAreas() {
    const res = await this.srvList.getviewAreas().toPromise();

    this.totalAreas = res.total;
  }

  async getListRegistros() {
    const res = await this.srvList.getListRegistros().toPromise();

    this.totalRegistros = res.total;
  }

  save(severity: string) {
    this.srvMessage.add({ severity: severity, summary: 'Success', detail: 'Data Saved' });
}

update() {
    this.srvMessage.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
}

delete() {
    this.srvMessage.add({ severity: 'success', summary: 'Success', detail: 'Data Deleted' });
}
}
