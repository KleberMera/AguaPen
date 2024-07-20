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
  selector: 'app-reportes-usuarios',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './reportes-usuarios.component.html',
  styleUrl: './reportes-usuarios.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class ReportesUsuariosComponent implements OnInit {
  listReports: any[] = [];
  filteredReports: any[] = [];
  uniqueUsers: any[] = [];
  searchQuery: string = '';
  selectedUser: any | null = null;
  listUniqueUsers: any[] = [];
  selectedDate: any | null = null;
  availableDates: any[] = [];
  loading: boolean = false;

  private srvList = inject(ListService);
  private srvMessage = inject(MessageService);

  ngOnInit(): void {
    this.viewListReports();
  }

  viewListReports() {
    this.loading = true;
    this.srvList.getviewRegistroAll().subscribe((res: any) => {
      this.listReports = res.data;
      this.filteredReports = res.data;
      this.uniqueUsers = this.getUniqueUsers(res.data);
      this.loading = false;
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
      this.setAvailableDates(this.filteredReports);
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
      this.selectedDate = null; // Reiniciar la fecha seleccionada
      this.filteredReports = this.listReports.filter((report) =>
        report.nombre.toLowerCase().includes(this.selectedUser.nombre.toLowerCase())
      );
      this.setAvailableDates(this.filteredReports);
    } else {
      this.filteredReports = this.listReports;
      this.availableDates = [];
    }
  }

  setAvailableDates(reports: any[]) {
    const datesSet = new Set<string>();
    console.log('Datos del usuario', reports);

    this.availableDates = reports
      .map((report) => {
        const fecha = new Date(report.fecha_registro)
          .toISOString()
          .split('T')[0]; // Formato AAAA-MM-DD
        if (!datesSet.has(fecha)) {
          datesSet.add(fecha);
          console.log('Fecha disponible', fecha);
          return { fecha };
        }
        return null;
      })
      .filter((date) => date !== null);

    console.log('Fechas disponibles', datesSet);
  }

  filterReportsByDate() {
    if (this.selectedDate && this.selectedUser) {
      const selectedDateStr = this.selectedDate.fecha;
      console.log('Fecha seleccionada:', selectedDateStr);

      this.filteredReports = this.listReports.filter((report) => {
        const reportDateStr = new Date(report.fecha_registro).toISOString().split('T')[0];
        return reportDateStr === selectedDateStr && report.nombre === this.selectedUser.nombre;
      });

      if (this.filteredReports.length > 0) {
        console.log('Datos retornados:', this.filteredReports);
      } else {
        console.log('No se retornaron datos para la fecha seleccionada.');
      }
    } else {
      if (!this.selectedUser) {
        console.log('No se seleccionó ningún usuario.');
      }
      if (!this.selectedDate) {
        console.log('No se seleccionó ninguna fecha.');
      }
      this.filteredReports = this.listReports;
    }
  }

  getTotalCantidad(): number {
    return this.filteredReports.reduce((total, report) => total + report.cantidad, 0);
  }
  
  
}
