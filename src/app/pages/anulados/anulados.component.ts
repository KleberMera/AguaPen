import { Component, inject, OnInit } from '@angular/core';
import { PRIMEMG_MODULES } from './anulados.imports';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListService } from '../../services/list.service';
import { PrintService } from '../../services/print.service';
import { CommonModule } from '@angular/common';
import { PrintvoidService } from '../../services/printvoid.service';
import { CountdataService } from '../../services/countdata.service';
import { CountreportsService } from '../../services/countreports.service';

@Component({
  selector: 'app-anulados',
  standalone: true,
  imports: [PRIMEMG_MODULES, FormsModule, FieldsetModule, CommonModule],
  templateUrl: './anulados.component.html',
  styleUrl: './anulados.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class AnuladosComponent   {
  listReports: any[] = []; // Lista completa de reportes
  filteredReports: any[] = []; // Lista filtrada de reportes
  uniqueItems: any[] = []; // Lista de items únicos (usuarios, áreas, vehículos)
  categories: any[] = [
    { label: 'Trabajadores', value: 'trabajadores' },
    { label: 'Areas', value: 'areas' },
    { label: 'Vehiculos', value: 'vehiculos' },
  ];

  selectedCategory: string = '';
  selectedItem: any | null = null;
  optionLabel: string = 'nombre'; // Campo usado como etiqueta en el dropdown
  filterBy: string = 'nombre,cedula'; // Campos usados para el filtrado en el dropdown

  startDate: string | null = null; // Fecha de inicio para el filtrado por fecha
  endDate: string | null = null; // Fecha de fin para el filtrado por fecha
  loading: boolean = true; // Indica si se está cargando datos
  reportCount: any[] = [] ; // Variable para contar los reportes generados

  private srvList = inject(ListService);
  private srvPrint = inject(PrintService);
  private srvPrintvoid = inject(PrintvoidService);


  // Extraer items únicos de la lista de reportes según la categoría
  extractUniqueItems(reports: any[], optionLabel: string): any[] {
    const itemsMap = new Map();
    reports.forEach((report) => {
      if (!itemsMap.has(report[optionLabel])) {
        itemsMap.set(report[optionLabel], report);
      }
    });
    return Array.from(itemsMap.values());
  }



  // Manejar el cambio de categoría
  onCategoryChange() {
    if (this.selectedCategory) {
      console.log('Categoría seleccionada:', this.selectedCategory);

      if (this.selectedCategory === 'trabajadores') {
        this.srvList.getReportsTrabajadores().subscribe((res: any) => {
          this.handleReports(res.data, 'nombre', 'nombre,cedula');
        });
      } else if (this.selectedCategory === 'areas') {
        this.srvList.getReportsAreas().subscribe((res: any) => {
          this.handleReports(res.data, 'nombre_area', 'nombre_area');
        });
      } else if (this.selectedCategory === 'vehiculos') {
        this.srvList.getReportsVehiculos().subscribe((res: any) => {
          this.handleReports(res.data, 'placa', 'placa');
        });
      }
    }
  }

  // Filtrar reportes por item seleccionado (usuario, área, vehículo)
  filterReportsByItem() {
    if (this.selectedItem) {
      this.filteredReports = this.listReports.filter((report) =>
        report[this.optionLabel]
          .toLowerCase()
          .includes(this.selectedItem[this.optionLabel].toLowerCase())
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
    this.srvPrintvoid.exportToPDFAnulados(
      this.filteredReports,
      this.selectedCategory,

    );
  }



  // Manejar los datos de reportes según la categoría
  handleReports(reports: any[], optionLabel: string, filterBy: string) {
    this.listReports = reports.filter(
      (report: any) => report.estado_registro === 0
    );
    console.log(this.listReports);
    
    this.filteredReports = this.listReports;
    this.uniqueItems = this.extractUniqueItems(this.listReports, optionLabel);
    this.optionLabel = optionLabel;
    this.filterBy = filterBy;
    this.loading = false;
  }
}
