import { Component, inject, OnInit } from '@angular/core';
import { PrintService } from '../../services/print.service';
import { ListService } from '../../services/list.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PRIMEMG_MODULES } from '../registros/registros.imports';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes-usuarios',
  standalone: true,
  imports: [PRIMEMG_MODULES, FormsModule],
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
  selectedDate: any | null = null;
  availableDates: any[] = [];
  loading: boolean = false;

  private srvList = inject(ListService);
  private srvMessage = inject(MessageService);
  private srvPrint = inject(PrintService);

  async ngOnInit(): Promise<void> {
    await this.viewListReports();
  }

  async viewListReports(): Promise<void> {
    this.loading = true;
    try {
      const res: any = await this.srvList.getReportsTrabajadores().toPromise();
      this.listReports = res.data.filter((report : any) => report.estado_registro === 1);
      this.filteredReports = this.listReports;
      this.uniqueUsers = this.getUniqueUsers(this.listReports);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      this.loading = false;
    }
  }

  getUniqueUsers(reports: any[]): any[] {
    const usersSet = new Set<string>();
    return reports.filter((report) => {
      if (!usersSet.has(report.nombre)) {
        usersSet.add(report.nombre);
        return true;
      }
      return false;
    });
  }

  searchReport(): void {
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

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredReports = this.listReports;
  }

  filterReportsByName(): void {
    if (this.selectedUser) {
      this.selectedDate = null;
      this.filteredReports = this.listReports.filter((report) =>
        report.nombre
          .toLowerCase()
          .includes(this.selectedUser.nombre.toLowerCase())
      );
      this.setAvailableDates(this.filteredReports);
    } else {
      this.filteredReports = this.listReports;
      this.availableDates = [];
    }
  }

  setAvailableDates(reports: any[]): void {
    const datesSet = new Set<string>();
    this.availableDates = reports
      .map((report) => {
        const fecha = new Date(report.fecha_registro)
          .toISOString()
          .split('T')[0];
        if (!datesSet.has(fecha)) {
          datesSet.add(fecha);
          return { fecha };
        }
        return null;
      })
      .filter((date) => date !== null);
  }

  filterReportsByDate(): void {
    if (this.selectedDate && this.selectedUser) {
      const selectedDateStr = this.selectedDate.fecha;
      this.filteredReports = this.listReports.filter((report) => {
        const reportDateStr = new Date(report.fecha_registro)
          .toISOString()
          .split('T')[0];
        return (
          reportDateStr === selectedDateStr &&
          report.nombre === this.selectedUser.nombre
        );
      });
    } else {
      this.filteredReports = this.listReports;
    }
  }

  getTotalCantidad(): number {
    return this.filteredReports.reduce(
      (total, report) => total + report.cantidad,
      0
    );
  }

  printTable(): void {
    this.srvPrint.printElement('reportTable');
  }
  exportToPDF(): void {
    this.srvPrint.exportToPDF(this.filteredReports);
    
  }
}
