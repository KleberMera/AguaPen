import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrintService } from '../../services/print.service';
import { Subscription } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { ListService } from '../../services/list.service';
import { FormsModule } from '@angular/forms';
import { PRIMEMG_MODULES } from './reportes.imports';


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [PRIMEMG_MODULES, FormsModule, FieldsetModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class ReportesComponent implements OnInit {
  listReports: any[] = []; // Lista completa de reportes
  filteredReports: any[] = []; // Lista filtrada de reportes
  uniqueUsers: any[] = []; // Lista de usuarios únicos
  searchQuery: string = ''; // Consulta de búsqueda
  selectedUser: any | null = null; // Usuario seleccionado
  startDate: string | null = null; // Fecha de inicio para el filtrado por fecha
  endDate: string | null = null; // Fecha de fin para el filtrado por fecha+
  loading: boolean = true; // Indica si se está cargando datos

  private subscriptions: Subscription = new Subscription(); // Manejo de suscripciones

  constructor(
    private srvList: ListService,
    private srvMessage: MessageService,
    private srvPrint: PrintService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Cancela todas las suscripciones al destruir el componente
  }

  // Cargar la lista de reportes desde el servicio
  loadReports() {
    const reportSubscription = this.srvList
      .getReportsTrabajadores()
      .subscribe((res: any) => {
        this.listReports = res.data.filter((report : any) => report.estado_registro === 1);
     
        
        this.filteredReports = this.listReports;
        this.uniqueUsers = this.extractUniqueUsers(this.listReports);
        this.loading = false;
      });

    this.subscriptions.add(reportSubscription); // Agregar suscripción al manejador de suscripciones
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

  // Buscar reportes por cédula
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

  // Limpiar búsqueda por cédula
  clearSearch() {
    this.searchQuery = '';
    this.filteredReports = this.listReports;
  }

  // Filtrar reportes por nombre de usuario seleccionado
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
    this.srvPrint.exportToPDF(this.filteredReports);
    
  }

  // Imprimir la tabla de reportes
  printTable(): void {
    this.srvPrint.printElement('reportTable');
  }
}
