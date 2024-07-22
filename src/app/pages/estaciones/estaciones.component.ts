import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ListService } from '../../services/list.service';

const PRIME_MODULES = [CardModule];

@Component({
  selector: 'app-estaciones',
  standalone: true,
  imports: [PRIME_MODULES],
  templateUrl: './estaciones.component.html',
  styleUrl: './estaciones.component.scss',
})
export default class EstacionesComponent implements OnInit {
  listEstaciones: any[] = [];

  private SrvList = inject(ListService);

  ngOnInit(): void {
    this.getListEstaciones();
  }

  getListEstaciones() {
    this.SrvList.getviewEstaciones().subscribe((res) => {
      this.listEstaciones = res.data;
      console.log(this.listEstaciones);
    });
  }
}
