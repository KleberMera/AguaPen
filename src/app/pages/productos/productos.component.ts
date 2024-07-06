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

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
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
  IconFieldModule,
  InputIconModule,
  AutoCompleteModule,
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
  filteredProductsSearch: any[] = [];
  filteredProducts: any[] = []; // Nueva propiedad para productos filtrados
  interfaceProduct: interfaceProducts[] = [];
  dialogVisible: boolean = false;
  selectedProduct: interfaceProducts | any = null;

  private srvList = inject(ListService);
  private srvReg = inject(RegisterService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);

  ngOnInit(): void {
    this.getListProductos();
  }

  private handleError(error: any, message: string): void {
    console.error(message, error);
    this.loading = false;
  }

  getListProductos() {
    this.srvList.getListProductos().subscribe(
      (res: any) => {
        this.listProduct = res.data;
        this.loading = false;
        this.filteredProducts = res.data;
      },
      (error) => this.handleError(error, 'Error al cargar productos:')
    );
  }

  filterProducts(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.listProduct.filter((product) =>
      product.nombre_producto.toLowerCase().includes(lowerQuery)
    );
  }

  openAddProductDialog() {
    this.selectedProduct = this.createNewProduct();
    this.dialogVisible = true;
  }

  openEditProductDialog(product: interfaceProducts) {
    this.selectedProduct = { ...product };
    this.selectedProduct.hora_producto = formatDate(
      new Date(),
      'HH:mm',
      'en-US'
    ); // Asigna la hora actual del sistema
    this.dialogVisible = true;
  }

  saveProduct() {
    this.loadingSave = true;
    setTimeout(() => {
      this.loadingSave = false;
    }, 2000);

    this.selectedProduct!.id === 0 ? this.addProduct() : this.editProduct();
  }

  private addProduct() {
    if (this.validateProduct()) {
      this.srvReg.postRegisterProducts(this.selectedProduct).subscribe(
        (res: any) =>
          this.handleResponse(res, 'Agregado', 'Error al agregar producto'),
        (error) => this.handleError(error, 'Error al agregar producto')
      );
    }
  }

  private editProduct() {
    if (this.validateProduct()) {
      this.srvReg.postEditProducts(this.selectedProduct).subscribe(
        (res: any) =>
          this.handleResponse(res, 'Editado', 'Error al editar producto'),
        (error) => this.handleError(error, 'Error al editar producto')
      );
    }
  }

  deleteProduct(product: interfaceProducts) {
    this.srvConfirm.confirm({
      message: '¿Está seguro de eliminar el producto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      accept: () => {
        this.srvReg.postDeleteProducts(product.id).subscribe(
          (res: any) =>
            this.handleResponse(res, 'Eliminado', 'Error al eliminar producto'),
          (error) => this.handleError(error, 'Error al eliminar producto')
        );
      },
    });
  }

  private handleResponse(
    res: any,
    successMessage: string,
    errorMessage: string
  ) {
    if (res.retorno == 1) {
      this.getListProductos();
      this.srvMensajes.add({
        severity: 'success',
        summary: successMessage,
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
  }

  private validateProduct(): boolean {
    if (this.selectedProduct.stock_producto < 0) {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El stock debe ser mayor o igual a 0',
      });
      return false;
    }

    if (this.selectedProduct.nombre_producto.trim() === '') {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre del producto es obligatorio',
      });
      return false;
    }

    return true;
  }

  private createNewProduct(): interfaceProducts {
    return {
      id: 0,
      nombre_producto: '',
      fecha_producto: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      hora_producto: formatDate(new Date(), 'HH:mm', 'en-US'),
      stock_producto: 0,
    };
  }
}
