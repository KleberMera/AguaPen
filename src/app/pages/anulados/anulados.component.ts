import { Component } from '@angular/core';
import { PRIMEMG_MODULES } from './anulados.imports';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListService } from '../../services/list.service';
import { Subscription } from 'rxjs';
import { PrintService } from '../../services/print.service';

@Component({
  selector: 'app-anulados',
  standalone: true,
  imports: [PRIMEMG_MODULES, FormsModule, FieldsetModule],
  templateUrl: './anulados.component.html',
  styleUrl: './anulados.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class AnuladosComponent {
  listReports: any[] = []; // Lista completa de reportes
  filteredReports: any[] = []; // Lista filtrada de reportes
  uniqueUsers: any[] = []; // Lista de usuarios únicos

  selectedUser: any | null = null;
  startDate: string | null = null; // Fecha de inicio para el filtrado por fecha
  endDate: string | null = null; // Fecha de fin para el filtrado por fecha+
  loading: boolean = true; // Indica si se está cargando datos

  constructor(
    private srvList: ListService,
    private srvMessage: MessageService,
    private srvPrint: PrintService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  // Cargar la lista de reportes desde el servicio
  loadReports() {
    const reportSubscription = this.srvList
      .getReportsTrabajadores()
      .subscribe((res: any) => {
        this.listReports = res.data.filter(
          (report: any) => report.estado_registro === 0
        );

        this.filteredReports = this.listReports;
        this.uniqueUsers = this.extractUniqueUsers(this.listReports);
        this.loading = false;
      });
  }

  // Extraer usuarios únicos de la lista de reportes
  extractUniqueUsers(reports: any[]): any[] {
    const usersMap = new Map();
    reports.forEach((report) => {
      if (!usersMap.has(report.nombre)) {
        usersMap.set(report.nombre, report);
      }
    });
    return Array.from(usersMap.values());
  }

  // Limpiar búsqueda por cédula
  clearSearch() {
    this.filteredReports = this.listReports;
  }

  // Filtrar reportes por nombre de usuario seleccionado
  filterReportsByName() {
    if (this.selectedUser) {
      this.filteredReports = this.listReports.filter(
        (report) =>
          report.nombre
            .toLowerCase()
            .includes(this.selectedUser.nombre.toLowerCase()) ||
          report.cedula
            .toLowerCase()
            .includes(this.selectedUser.cedula.toLowerCase())
      );
    } else {
      this.filteredReports = this.listReports;
    }
  }

  // Filtrar reportes por rango de fechas
  filterReportsByDate() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.filteredReports = this.listReports.filter((report) => {
        const reportDate = new Date(report.fecha_registro);
        return reportDate >= start && reportDate <= end;
      });
    } else {
      this.filteredReports = this.listReports;
    }
  }

  // Limpiar filtro de fechas
  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filteredReports = this.listReports;
  }

  // Exportar la tabla de reportes a PDF
  exportToPDF(): void {
    this.srvPrint.exportToPDFAnulados(this.filteredReports);
  }

  // Imprimir la tabla de reportes
  printTable(): void {
    this.srvPrint.printElement('reportTable');
  }
}
