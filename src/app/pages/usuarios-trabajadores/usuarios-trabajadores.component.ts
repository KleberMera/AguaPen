import { Component, inject, OnInit } from '@angular/core';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-usuarios-trabajadores',
  standalone: true,
  imports: [],
  templateUrl: './usuarios-trabajadores.component.html',
  styleUrl: './usuarios-trabajadores.component.scss',
})
export default class UsuariosTrabajadoresComponent implements OnInit {
  ListUsersWorkers: any[] = []; // Esta lista tiene tx_nombre, tx_cedula,tx_cargo, tx_area

  private srvList = inject(ListService);

  ngOnInit(): void {
    this.getListUsuarios();
  }

  getListUsuarios() {
    this.srvList.getListUsuarios().subscribe((res) => {
      console.log(res.data);
      this.ListUsersWorkers = res.data;
    });
  }
}
