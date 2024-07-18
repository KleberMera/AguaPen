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
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
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
  CalendarModule,
];
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class ReportesComponent implements OnInit {
  listReports: any[] = []; //Esta lista trae id_registro, fecha, nombre, nombre_producto, cantidad, total_cantidades, cedula, observacion
  filteredReports: any[] = [];
  uniqueUsers: any[] = [];
  searchQuery: string = '';
  selectedUser: any | null = null;
  listUniqueUsers: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  loading: boolean = false; // Estado de carga

  private srvList = inject(ListService);
  private srvMessage = inject(MessageService);

  ngOnInit(): void {
    this.viewListReports();
  }

  viewListReports() {
    this.loading = true; // Mostrar pantalla de carga
    this.srvList.getviewRegistroAll().subscribe((res: any) => {
      this.listReports = res.data;
      this.filteredReports = res.data;
      this.uniqueUsers = this.getUniqueUsers(res.data);
      console.log('Listado de Reportes:', this.listReports);
      this.loading = false; // Ocultar pantalla de carga
    });
  }

  getUniqueUsers(reports: any[]): any[] {
    const usersSet = new Set();
    const uniqueUsers = this.listUniqueUsers;

    reports.forEach((report) => {
      if (!usersSet.has(report.nombre)) {
        usersSet.add(report.nombre);
        uniqueUsers.push(report);
      }
    });

    return uniqueUsers;
  }

  searchReport() {
    if (this.searchQuery.trim() === '') {
      this.filteredReports = this.listReports;
      return;
    }

    this.filteredReports = this.listReports.filter(
      (report) =>
        report.cedula &&
        report.cedula.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (this.filteredReports.length > 0) {
      this.selectedUser = this.filteredReports[0];
      this.srvMessage.add({
        severity: 'success',
        summary: 'Usuario encontrado',
        detail: `Se encontraron ${this.filteredReports.length} datos de reportes`,
      });
    } else {
      this.selectedUser = null;
      this.srvMessage.add({
        severity: 'error',
        summary: 'Usuario no encontrado',
        detail: 'No se encontraron usuarios con ese criterio de búsqueda',
      });
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredReports = this.listReports;
  }

  filterReportsByName() {
    if (this.selectedUser) {
      this.filteredReports = this.listReports.filter((report) =>
        report.nombre
          .toLowerCase()
          .includes(this.selectedUser.nombre.toLowerCase())
      );
    } else {
      this.filteredReports = this.listReports;
    }
  }

  filterReportsByDate() {
    if (this.startDate !== null && this.endDate !== null) {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      this.filteredReports = this.listReports.filter((report) => {
        const reportDate = new Date(report.fecha_registro);
        return (
          this.compareDates(reportDate, startDate) >= 0 &&
          this.compareDates(reportDate, endDate) <= 0
        );
      });
    } else {
      this.filteredReports = this.listReports;
    }
  }

  compareDates(date1: Date, date2: Date): number {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
  }

  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filteredReports = this.listReports;
  }
}
