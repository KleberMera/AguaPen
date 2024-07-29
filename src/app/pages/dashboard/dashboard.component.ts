import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CountdataService } from '../../services/countdata.service';
import { ListService } from '../../services/list.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PRIMENG_MODULES } from './dashboard.imports';
import { MenuItem, MessageService } from 'primeng/api';

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
  private srvCount = inject(CountdataService);
  private userSubscription!: Subscription;
  private dataSubscriptions: Subscription[] = [];
  public dataSubscription!: Subscription;

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
    const resc = await this.srvCount.countProducts().toPromise();
    this.totalProductos = resc.data;
    const res = await this.srvList.getlistProducts().toPromise();
    const topProducts = res.data
      .sort((a: any, b: any) => b.stock_producto - a.stock_producto)
      .slice(0, 5);

    this.chartData = {
      labels: topProducts.map((product: any) => product.nombre_producto),
      datasets: [
        {
          data: topProducts.map((product: any) => product.stock_producto),
          backgroundColor: [
            '#FF3284',
            '#36A2EB',
            '#FFCE56',
            '#FF9F40',
            '#FF6384',
          ],
        },
      ],
    };

    const res2 = await this.srvCount.countUsers().toPromise();
    this.totalUsuarios = res2.data;

    const res3 = await this.srvCount.countAreas().toPromise();
    this.totalAreas = res3.data;

    this.loading = false;
  }

  fetchAreas(): void {
    this.dataSubscription = this.srvList.getReportsAreas().subscribe((res) => {
      this.areas = res.data;

      this.loading = false;
    });
  }

  navigateTo(route: string): void {
    switch (route) {
      case 'productos':
        this.router.navigate(['/home/registros']);
        break;
      case 'extintores':
        this.router.navigate(['/home/registros-areas']);
        break;
      case 'home/productos':
        this.router.navigate(['/home/productos']);
        break;
      case 'home/areas':
        this.router.navigate(['/home/areas']);
        break;
      case 'home/trabajadores':
        this.router.navigate(['/home/trabajadores']);
        break;
      default:
        break;
    }
  }
}
