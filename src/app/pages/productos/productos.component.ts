import { Component, OnInit, inject } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { ListService } from '../../services/list.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
const PRIMEMG_MODULES = [FieldsetModule, TableModule, CardModule, ButtonModule, ProgressSpinnerModule];

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, PRIMEMG_MODULES],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
})
export default class ProductosComponent implements OnInit {
  listProduct: any[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  private srvList = inject(ListService);

  ngOnInit(): void {
    console.log('ProductosComponent');

    this.getListProductos();
  }

  getListProductos() {
    this.srvList.getListProductos().subscribe((res: any) => {
      console.log(res.data);
      this.listProduct = res.data;
      this.loading = false;  // Productos cargados, detener la carga
      console.log(this.listProduct);
    }, error => {
      console.error('Error al cargar productos:', error);
      this.loading = false;  // En caso de error, también detener la carga
    });
  }

  filteredProducts() {
    return this.listProduct.filter((product) =>
      product.nombre_producto
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  editProduct(product: any) {
    console.log('Editar producto:', product);
    // Implementar lógica de edición
  }

  deleteProduct(product: any) {
    console.log('Eliminar producto:', product);
    // Implementar lógica de eliminación
  }

  addProduct() {
    // Aquí puedes implementar la lógica para agregar un nuevo producto.
    console.log('Agregar nuevo producto');
    // Por ejemplo, podrías abrir un modal o navegar a una ruta de creación de producto.
  }
}
