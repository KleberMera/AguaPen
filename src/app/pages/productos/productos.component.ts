import { Component, OnInit, inject } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { ListService } from '../../services/list.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RegisterService } from '../../services/register.service';
import { interfaceProducts } from '../../interfaces/productos.interfaces';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { formatDate } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

const PRIMEMG_MODULES = [
  FieldsetModule,
  TableModule,
  CardModule,
  ButtonModule,
  ProgressSpinnerModule,
  DialogModule,
  ToastModule,
  ConfirmDialogModule,
  InputTextModule,
];

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, PRIMEMG_MODULES],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class ProductosComponent implements OnInit {
  listProduct: any[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  loadingSave: boolean = false;

  //interface
  interfaceProduct: interfaceProducts[] = [];
  dialogVisible: boolean = false;
  selectedProduct: interfaceProducts | any = null;

  //injector
  private srvList = inject(ListService);
  private srvReg = inject(RegisterService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);

  ngOnInit(): void {
    console.log('ProductosComponent');

    this.getListProductos();
  }

  getListProductos() {
    this.srvList.getListProductos().subscribe(
      (res: any) => {
        console.log(res.data);
        this.listProduct = res.data;
        this.loading = false; // Productos cargados, detener la carga
        console.log(this.listProduct);
      },
      (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false; // En caso de error, también detener la carga
      }
    );
  }

  filteredProducts() {
    return this.listProduct.filter((product) =>
      product.nombre_producto
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  openAddProductDialog() {
    this.selectedProduct = {
      id: 0,
      nombre_producto: '',
      fecha_producto: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      hora_producto: formatDate(new Date(), 'HH:mm', 'en-US'),
      stock_producto: 0,
    };
    this.dialogVisible = true;
  }

  openEditProductDialog(product: interfaceProducts) {
    this.selectedProduct = { ...product };
    this.selectedProduct.hora_producto = formatDate(
      new Date(),
      'HH:mm',
      'en-US'
    ); // Configura la hora del sistema al editar
    this.dialogVisible = true;
  }

  saveProduct() {
    this.loadingSave = true;

    setTimeout(() => {
      this.loadingSave = false;
    }, 2000);
    if (this.selectedProduct!.id === 0) {
      this.addProduct();
    } else {
      this.editProduct();
    }
  }

  addProduct() {
    this.srvReg
      .postRegisterProducts(this.selectedProduct)
      .subscribe((res: any) => {
        if (res.retorno == 1) {
          this.getListProductos();
          this.srvMensajes.add({
            severity: 'success',
            summary: 'Agregado',
            detail: res.mensaje,
          });
        } else {
          this.srvMensajes.add({
            severity: 'error',
            summary: 'Error',
            detail: res.mensaje,
          });
        }
        this.dialogVisible = false;
      });
  }

  editProduct() {
    this.srvReg.postEditProducts(this.selectedProduct).subscribe((res: any) => {
      if (res.retorno == 1) {
        this.getListProductos();
        this.srvMensajes.add({
          severity: 'success',
          summary: 'Editado',
          detail: res.mensaje,
        });
      } else {
        this.srvMensajes.add({
          severity: 'error',
          summary: 'Error',
          detail: res.mensaje,
        });
      }
      this.dialogVisible = false;
    });
  }

  deleteProduct(product: interfaceProducts) {
    this.srvConfirm.confirm({
      message: '¿Está seguro de eliminar el producto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
     
      accept: () => {
        this.srvReg.postDeleteProducts(product.id).subscribe((res: any) => {
          if (res.retorno == 1) {
            console.log('Producto eliminado exitosamente');

            this.getListProductos();

            this.srvMensajes.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: res.mensaje,
            });
          } else {
            console.log('Error al eliminar producto');

            this.srvMensajes.add({
              severity: 'error',
              summary: 'Error',
              detail: res.mensaje,
            });
          }
        });
      },
    });
  }
}
