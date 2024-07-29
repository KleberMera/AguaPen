// Imports for Angular
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';

// Services and interfaces for the app
import { RegisterService } from '../../services/register.service';

import { ListService } from '../../services/list.service';

// Imports for PrimeNG
import { PRIMENG_MODULES } from './productos.import';
// Providers for PrimeNG
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../interfaces/products.interfaces';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, PRIMENG_MODULES],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class ProductosComponent implements OnInit {
  // List of products
  listProduct: Product[] = [];
  searchTerm: string = '';
  selectedProduct: Product | null = null;
  // Loading state
  loading: boolean = true;
  loadingSave: boolean = false;
  dialogVisible: boolean = false;

  // Services injected
  private srvList = inject(ListService);
  private srvReg = inject(RegisterService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);

  ngOnInit(): void {
    this.listProductos();
  }

  private async listProductos() {
    this.loading = true;
    try {
      const res = await this.srvList.getlistProducts().toPromise();
      this.listProduct = res.data;
    } catch (error) {
      this.handleError(error, 'Error al cargar productos:');
    } finally {
      this.loading = false;
    }
  }

  filterProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.listProduct.filter((product) =>
      product.nombre_producto.toLowerCase().includes(lowerQuery)
    );
  }

  openAddProductDialog() {
    this.selectedProduct = this.createNewProduct();
    this.dialogVisible = true;
  }

  openEditProductDialog(product: Product) {
    this.selectedProduct = { ...product };
    this.selectedProduct.hora_producto = formatDate(
      new Date(),
      'HH:mm',
      'en-US'
    );
    this.dialogVisible = true;
  }

  private createNewProduct(): Product {
    return {
      id: 0,
      nombre_producto: '',
      fecha_producto: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      hora_producto: formatDate(new Date(), 'HH:mm', 'en-US'),
      stock_producto: 0,
      cantidad: 0,
    };
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

  deleteProduct(product: Product) {
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

          await this.listProductos();
        } catch (error) {
          this.handleError(error, 'Error al eliminar producto');
        }
      },
    });
  }

  async saveProduct() {
    if (!this.selectedProduct) return;

    this.loadingSave = true;
    try {
      this.selectedProduct.id === 0
        ? await this.addProduct()
        : await this.editProduct();
      this.dialogVisible = false;
      await this.listProductos();
    } catch (error) {
      this.handleError(error, 'Error al guardar el producto');
    } finally {
      this.loadingSave = false;
    }
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
