import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrintService } from '../../../services/services_sg/print.service';
import { Subscription } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { ListService } from '../../../services/services_sg/list.service';
import { FormsModule } from '@angular/forms';
import { PRIMEMG_MODULES } from './reportes.imports';
import { ReporteService } from '../../../services/services_sg/reporte.service';

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
  uniqueProducts: any[] = []; // Lista de productos únicos
  uniqueUsersRegistered: any[] = []; // Lista de usuarios únicos que hicieron el registro
  selectedProduct: any | null = null; // Producto seleccionado
  selectedReport: any | null = null; // Reporte seleccionado

  private subscriptions: Subscription = new Subscription(); // Manejo de suscripciones

  constructor(
    private srvList: ListService,
    private srvMessage: MessageService,
    private srvPrint: PrintService,
    private srvReport: ReporteService
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
        this.listReports = res.data.filter(
          (report: any) => report.estado_registro === 1
        );

        this.filteredReports = this.listReports;
        this.uniqueUsers = this.extractUniqueUsers(this.listReports);
        this.uniqueProducts = this.extractUniqueProducts(this.listReports);
        this.uniqueUsersRegistered = this.extractUniqueUsersRegistered(this.listReports);

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

  extractUniqueProducts(reports: any[]): any[] {
    const productsMap = new Map();
    reports.forEach((report) => {
      if (!productsMap.has(report.nombre_producto)) {
        productsMap.set(report.nombre_producto, report);
      }
    });
    return Array.from(productsMap.values());
  }

  extractUniqueUsersRegistered(reports: any[]): any[] {
    const usersMap = new Map();
    reports.forEach((report) => {
      if (!usersMap.has(report.nombre_completo)) {
        usersMap.set(report.nombre_completo, report);
      }
    });
    return Array.from(usersMap.values());
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

  // Filtrar reportes por nombre de usuario que hizo el registro
  filterReportsByUserRegistered() {
    if (this.selectedReport) {
      this.filteredReports = this.listReports.filter((report) =>
        report.nombre_completo
          .toLowerCase()
          .includes(this.selectedReport.nombre_completo.toLowerCase())
      );
    } else {
      this.filteredReports = this.listReports;
    }
  }

  filterReportsByProduct() {
    if (this.selectedProduct) {
      this.filteredReports = this.listReports.filter((report) =>
        report.nombre_producto
          .toLowerCase()
          .includes(this.selectedProduct.nombre_producto.toLowerCase())
      );
    } else {
      this.filteredReports = this.listReports;
    }
  }

  filterReportsByDate() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      this.filteredReports = this.listReports.filter((report) => {
        const reportDate = new Date(report.fecha_registro);
        const isWithinDateRange = reportDate >= start && reportDate <= end;

        const matchesUser = this.selectedUser
          ? report.nombre
              .toLowerCase()
              .includes(this.selectedUser.nombre.toLowerCase())
          : true;

        const matchesProduct = this.selectedProduct
          ? report.nombre_producto
              .toLowerCase()
              .includes(this.selectedProduct.nombre_producto.toLowerCase())
          : true;

        const matchesUserRegistered = this.selectedReport
          ? report.nombre_completo
              .toLowerCase()
              .includes(this.selectedReport.nombre_completo.toLowerCase())
          : true;

        return (
          isWithinDateRange &&
          matchesUser &&
          matchesProduct &&
          matchesUserRegistered
        );
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
    if (this.listReports.length > 0) {
      this.srvPrint.exportToPDF(this.filteredReports);
      this.srvMessage.add({
        severity: 'info',
        summary: 'Generando reporte',
        detail: 'Espere un momento mientras se genera el reporte',
      });
    } else {
      this.srvMessage.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay registros para imprimir',
      });
    }
  }

  // Imprimir la tabla de reportes
  printTable(): void {
    this.srvPrint.printElement('reportTable');
  }

  downloadGeneralReport() {
    // Validar si se ha seleccionado un producto
    if (!this.selectedProduct || !this.selectedProduct.nombre_producto) {
      this.srvMessage.add({
        severity: 'error',
        summary: 'Selección de producto',
        detail: 'Debe seleccionar un producto para generar el reporte.',
      });
      return;
    }

    // Validar si se ha seleccionado al menos un reporte después de aplicar filtros
    if (!this.filteredReports || this.filteredReports.length === 0) {
      this.srvMessage.add({
        severity: 'error',
        summary: 'Reportes',
        detail: 'No se encontraron reportes con los criterios seleccionados.',
      });
      return;
    }

    // Validar si las fechas están definidas y son válidas
    if (!this.startDate || !this.endDate) {
      this.srvMessage.add({
        severity: 'error',
        summary: 'Fechas',
        detail: 'Debe seleccionar un rango de fechas para generar el reporte.',
      });
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (start > end) {
      this.srvMessage.add({
        severity: 'error',
        summary: 'Fechas inválidas',
        detail: 'La fecha de inicio debe ser anterior a la fecha de fin.',
      });
      return;
    }

    // Si todas las validaciones pasan, generar el reporte
    this.srvReport
      .RepGeneral(this.filteredReports)
      .then(() => {
        this.srvMessage.add({
          severity: 'success',
          summary: 'Reporte generado',
          detail: 'El reporte general ha sido generado exitosamente.',
        });
      })
      .catch((error) => {
        console.error('Error al generar el reporte:', error);
        this.srvMessage.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un problema al generar el reporte.',
        });
      });
  }
}
