import { Component, inject } from '@angular/core';

import { TableModule } from 'primeng/table';
import { ProductosService } from '../../servicios/productos.service';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ TableModule ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export default class ProductosComponent {

  listProductos: any;
  private srvProd = inject(ProductosService);


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getProductos();
  }

  getProductos() {
    this.srvProd.getProductos().subscribe((res: any) => {
      console.log(res.data);
      this.listProductos = res.data;
    });
  }
}
