import { Component, OnInit, inject } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { ListService } from '../../services/list.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
const PRIMEMG_MODULES = [
  FieldsetModule,
  TableModule,
  CardModule,
  ButtonModule,
];

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export default class ProductosComponent implements OnInit {

listProduct: any[] = [];
  private srvList = inject(ListService);

  ngOnInit(): void {
      console.log('ProductosComponent');
    this.srvList.getListProductos().subscribe((res: any) => {
      console.log(res.data);
      this.listProduct = res.data;
      console.log(this.listProduct);
     
    });

  }
}
