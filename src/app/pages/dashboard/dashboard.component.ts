import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
const PRIMENG_MODULES = [
  CardModule,
  ButtonModule,
  SplitButtonModule,
  ToastModule,
  RippleModule,
  ProgressSpinnerModule,
  TableModule,
  ChartModule,
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PRIMENG_MODULES],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [MessageService],
})
export default class DashboardComponent implements OnInit {
  nombres: string | null = '';
  usuario_id: string | null = '';
  apellidos: string | null = '';

  totalProductos: string = '';
  totalUsuarios: string = '';
  totalAreas: string = '';
  totalRegistros: string = '';
  items: MenuItem[] = [];
  loading: boolean = true;
  areas: any[] = [];
  chartData: any; // Data for the chart

  private srvAuth = inject(AuthService);
  private router = inject(Router);
  private srvList = inject(ListService);
  private userSubscription!: Subscription;
  private dataSubscriptions: Subscription[] = [];
  private dataSubscription!: Subscription;

  ngOnInit(): void {
    this.userSubscription = this.srvAuth.user$.subscribe((user) => {
      if (user) {
        this.nombres = user.nombres;
        this.usuario_id = user.id;
        this.apellidos = user.apellidos;
      }
    });
    this.fetchData();
    this.fetchAreas();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.dataSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  async fetchData(): Promise<void> {
    const res = await this.srvList.getListProductos().toPromise();
    this.totalProductos = res.total;

    const topProducts = res.data
      .sort((a: any, b: any) => b.stock_producto - a.stock_producto)
      .slice(0, 5);

    this.chartData = {
      labels: topProducts.map((product: any) => product.nombre_producto),
      datasets: [
        {
          data: topProducts.map((product: any) => product.stock_producto),
          backgroundColor: ['#FF3284', '#36A2EB', '#FFCE56', '#FF9F40', '#FF6384'],
        },
      ],
    };

    const res2 = await this.srvList.countusers().toPromise();
    this.totalUsuarios = res2.data;

    const res3 = await this.srvList.getviewAreas().toPromise();
    this.totalAreas = res3.total;

    this.loading = false;
  }

  navigateTo(event: Event): void {
    this.router.navigate(['/home/registros']);
  }

  fetchAreas(): void {
    this.dataSubscription = this.srvList.viewReportesDeAREAS().subscribe((res) => {
      this.areas = res.data;
      console.log(this.areas);
      
      this.loading = false;
    });
  }
}
