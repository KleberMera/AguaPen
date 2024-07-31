import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListService } from '../../services/list.service';
import { PrintService } from '../../services/print.service';
import { MessageService } from 'primeng/api';
import { PRIMEMG_MODULES } from './reportes-vehiculos.import';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes-vehiculos',
  standalone: true,
  imports: [ PRIMEMG_MODULES, FormsModule ],
  templateUrl: './reportes-vehiculos.component.html',
  styleUrl: './reportes-vehiculos.component.scss',
  providers: [MessageService],
})
export default class ReportesVehiculosComponent {
  listVehiculos: any[] = [];
  listReports: any[] = [];
  filteredReports: any[] = [];
  uniqueVehiculos: any[] = [];
  selectedVehiculo: any | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  loading: boolean = true;
  private subscriptions: Subscription = new Subscription(); // Manejo de suscripciones
  private SrvList = inject(ListService);
  private srvPrint = inject(PrintService);
  private srvMessage = inject(MessageService);

  ngOnInit(): void {
    this.getListVehiculos();
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Cancela todas las suscripciones al destruir el componente
  }

  loadReports() {
    const reportSubscription = this.SrvList.getReportsVehiculos().subscribe(
      (res: any) => {
        this.listReports = res.data;
        this.filteredReports = res.data;
        this.uniqueVehiculos = this.extractUniqueVehiculos(res.data);
        console.log('Listado de Reportes:', this.listReports);
        this.loading = false;
      }
    );

    this.subscriptions.add(reportSubscription); // Agregar suscripción al manejador de suscripciones
  }

  // Extraer áreas únicas de la lista de reportes
  extractUniqueVehiculos(reports: any[]): any[] {
    const vehiculoMap = new Map();
    reports.forEach((report) => {
      if (!vehiculoMap.has(report.placa)) {
        vehiculoMap.set(report.placa, report);
      }
    });
    return Array.from(vehiculoMap.values());
  }

  clearSearch() {
    this.selectedVehiculo = null;
    this.filteredReports = this.listReports;
  }

  filterReportsByNameAREA() {
    if (this.selectedVehiculo && this.selectedVehiculo.placa) {
      const selectedVehiculoName = this.selectedVehiculo.placa.toLowerCase();
    
      this.filteredReports = this.listReports.filter(
        (report) =>
          report.placa &&
          report.placa.toLowerCase().includes(selectedVehiculoName)
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

  getListVehiculos() {
    this.SrvList.getListVehiculos().subscribe((res) => {
      this.listVehiculos = res.data;
      console.log(this.listVehiculos);
      
    });
  }

  printTable(): void {
    this.srvPrint.printElement('reportTable');
  }
}
