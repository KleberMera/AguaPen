import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
import { PrintService } from '../../services/print.service';
import { Subscription } from 'rxjs';

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
  selector: 'app-areas',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export default class AreasComponent implements OnInit, OnDestroy {
  listAreas: any[] = [];
  listReports: any[] = []; // Lista completa de reportes
  filteredReports: any[] = []; // Lista filtrada de reportes
  uniqueAreas: any[] = []; // Lista de áreas únicas
  selectedArea: any | null = null; // Área seleccionada
  startDate: string | null = null; // Fecha de inicio para el filtrado por fecha
  endDate: string | null = null; // Fecha de fin para el filtrado por fecha
  loading: boolean = true; // Indica si se está cargando datos
  private subscriptions: Subscription = new Subscription(); // Manejo de suscripciones
  private SrvList = inject(ListService);
  private srvPrint = inject(PrintService);
  private srvMessage = inject(MessageService);

  ngOnInit(): void {
    this.getListAreas();
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Cancela todas las suscripciones al destruir el componente
  }

  loadReports() {
    const reportSubscription = this.SrvList.getReportsAreas().subscribe((res: any) => {
      this.listReports = res.data;
      this.filteredReports = res.data;
      this.uniqueAreas = this.extractUniqueAreas(res.data);
      console.log('Listado de Reportes:', this.listReports);
      this.loading = false;
    });

    this.subscriptions.add(reportSubscription); // Agregar suscripción al manejador de suscripciones
  }

  // Extraer áreas únicas de la lista de reportes
  extractUniqueAreas(reports: any[]): any[] {
    const areasMap = new Map();
    reports.forEach((report) => {
      if (!areasMap.has(report.nombre_area)) {
        areasMap.set(report.nombre_area, report);
      }
    });
    return Array.from(areasMap.values());
  }

  clearSearch() {
    this.selectedArea = null;
    this.filteredReports = this.listReports;
  }

  filterReportsByNameAREA() {
    if (this.selectedArea && this.selectedArea.nombre_area) {
      const selectedAreaName = this.selectedArea.nombre_area.toLowerCase();
      this.filteredReports = this.listReports.filter((report) => 
        report.nombre_area && report.nombre_area.toLowerCase().includes(selectedAreaName)
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

  getListAreas() {
    this.SrvList.getviewAreas().subscribe((res) => {
      this.listAreas = res.data;
      console.log(this.listAreas);
    });
  }

  printTable(): void {
    this.srvPrint.printElement('reportTable');
  }
}
