import { Component, inject, OnInit } from '@angular/core';
import { PRIMEMG_MODULES } from './edit-delete.imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ListService } from '../../services/list.service';
import { PrintService } from '../../services/print.service';

@Component({
  selector: 'app-edit-delete',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './edit-delete.component.html',
  styleUrls: ['./edit-delete.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export default class EditDeleteComponent implements OnInit {
  listReportsArea: any[] = [];
  listReportsUsuario: any[] = [];
  listReportsVehicles: any[] = [];

  loading: boolean = false;

  private subscriptions: Subscription = new Subscription(); // Manejo de suscripciones
  private SrvList = inject(ListService);
  private srvPrint = inject(PrintService);
  private srvMessage = inject(MessageService);

  loadReportsArea() {
    const reportSubscription = this.SrvList.getReportsAreas().subscribe(
      (res: any) => {
        this.listReportsArea = res.data;
        console.log('Listado de Reportes:', this.listReportsArea);
      }
    );

    // Añadir la suscripción a la lista de suscripciones
    this.subscriptions.add(reportSubscription);
  }
ngOnInit() {
  this.loadReportsArea();
  this.loadReportsUsers();
  this.loadReportsVehicles();
}
  ngOnDestroy() {
    // Limpiar las suscripciones cuando el componente se destruya
    this.subscriptions.unsubscribe();
  }

  async loadReportsUsers(): Promise<void> {
    this.loading = true;
    try {
      const res: any = await this.SrvList.getviewRegistroAll().toPromise();
      this.listReportsUsuario = res.data;
      console.log('Listado de Usuarios:', this.listReportsUsuario);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      this.loading = false;
    }
  }



  loadReportsVehicles() {
    const reportSubscription = this.SrvList.getReportsVehiculos().subscribe(
      (res: any) => {
        this.listReportsVehicles = res.data;
        console.log('Listado de vehiculos:', this.listReportsVehicles);
        this.loading = false;
      }
    );

    this.subscriptions.add(reportSubscription); // Agregar suscripción al manejador de suscripciones
  }
}
