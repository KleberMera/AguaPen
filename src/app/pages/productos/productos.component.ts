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
  listProduct: interfaceProducts[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  loadingSave: boolean = false;
  dialogVisible: boolean = false;
  selectedProduct: interfaceProducts | null = null;

  private srvList = inject(ListService);
  private srvReg = inject(RegisterService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);

  ngOnInit(): void {
    this.getListProductos();
  }

  private async getListProductos() {
    this.loading = true;
    try {
      const res = await this.srvList.getListProductos().toPromise();
      this.listProduct = res.data;
      console.log(res);
      
    } catch (error) {
      this.handleError(error, 'Error al cargar productos:');
    } finally {
      this.loading = false;
    }
  }

  filterProducts(query: string): interfaceProducts[] {
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
    this.dialogVisible = true;
  }

  async saveProduct() {
    if (!this.selectedProduct) return;

    this.loadingSave = true;
    try {
      this.selectedProduct.id === 0
        ? await this.addProduct()
        : await this.editProduct();
      this.dialogVisible = false;
      await this.getListProductos();
    } catch (error) {
      this.handleError(error, 'Error al guardar el producto');
    } finally {
      this.loadingSave = false;
    }
  }

  private async addProduct() {
    if (!this.validateProduct()) return;
    try {
      const res = await this.srvReg
        .postRegisterProducts(this.selectedProduct!)
        .toPromise();
      this.handleResponse(res, 'Agregado');
    } catch (error) {
      this.handleError(error, 'Error al agregar producto');
    }
  }

  private async editProduct() {
    if (!this.validateProduct()) return;
    try {
      const res = await this.srvReg
        .postEditProducts(this.selectedProduct!)
        .toPromise();
      this.handleResponse(res, 'Editado');
    } catch (error) {
      this.handleError(error, 'Error al editar producto');
    }
  }

  deleteProduct(product: interfaceProducts) {
    console.log(product.id);
    
    this.srvConfirm.confirm({
      message: '¿Está seguro de eliminar el producto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      accept: async () => {
        try {
          const res = await this.srvReg
            .requestdeleteProducts(product.id)
            .toPromise();
          this.handleResponse(res, 'Eliminado');
          console.log(res);
          await this.getListProductos();
          
        } catch (error) {
          this.handleError(error, 'Error al eliminar producto');
        }
      },
    });
  }

  private handleResponse(res: any, successMessage: string) {
    if (
      (res.created && res.created.length > 0) ||
      (res.updated && res.updated.length > 0) ||
      (res.data && res.data.length >= 0)

    ) {
      this.srvMensajes.add({
        severity: 'success',
        summary: successMessage,
        detail: `${successMessage} exitosamente.`,
      });
    }
  }

  private validateProduct(): boolean {
    if (this.selectedProduct!.stock_producto < 0) {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El stock debe ser mayor o igual a 0',
      });
      return false;
    }

    if (this.selectedProduct!.nombre_producto.trim() === '') {
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

  private handleError(error: any, message: string): void {
    console.error(message, error);
    this.srvMensajes.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al procesar la solicitud',
    });
    this.loading = false;
    this.loadingSave = false;
  }
}
