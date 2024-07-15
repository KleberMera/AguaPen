import { Component, inject, OnInit } from '@angular/core';

import { FieldsetModule } from 'primeng/fieldset';
import { ListService } from '../../services/list.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { SpinnerModule } from 'primeng/spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
const PRIMEMG_MODULES = [
  TableModule,
  FieldsetModule,
  ButtonModule,
  FormsModule,
  InputIconModule,
  InputTextModule,
  ToastModule,
  AutoCompleteModule,
  IconFieldModule,
  DropdownModule,
  CardModule,
  BlockUIModule,
  SpinnerModule,
  ProgressSpinnerModule,
];
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss',
})
export default class ReportesComponent implements OnInit {
  listReports: any[] = []; //Esta lista trae id_registro, fecha, nombre, nombre_producto, cantidad, total_cantidades, cedula

  private srvList = inject(ListService);

  ngOnInit(): void {
    this.viewListReports();
  }

  //Listado de Reportes
  viewListReports() {
    this.srvList.getviewRegistroAll().subscribe((res: any) => {
      console.log('Listado de Reportes:', res.data);
      this.listReports = res.data;
      console.log('Listado de Reportes:', this.listReports);
    });
  }
}
