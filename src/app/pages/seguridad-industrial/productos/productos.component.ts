// Imports for Angular
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';

// Services and interfaces for the app
import { RegisterService } from '../../../services/services_sg/register.service';

import { ListService } from '../../../services/services_sg/list.service';

// Imports for PrimeNG
import { PRIMENG_MODULES } from './productos.import';
// Providers for PrimeNG
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../../interfaces/products.interfaces';
import { DeleteService } from '../../../services/services_sg/delete.service';
import { AuthService } from '../../../services/services_auth/auth.service';
import { PermisosService } from '../../../services/services_auth/permisos.service';

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
  per_editar: number = 0;

  // Services injected
  private srvList = inject(ListService);
  private srvReg = inject(RegisterService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);
  private srvDelete = inject(DeleteService);
  private srvAuth = inject(AuthService);
  private srvPermisos = inject(PermisosService);

  ngOnInit(): void {
     this.getUserRole();
    
  }

  async getUserRole() {
    try {
      const res = await this.srvAuth.viewDataUser().toPromise();

      const user_id = res.data.id;

      if (user_id) {
        const permisos = await this.srvPermisos
          .getListPermisosPorUsuario(user_id)
          .toPromise();
        const data = permisos.data;

        //Recorrer la data
        data.forEach((permiso: any) => {
          if (
            permiso.modulo_id === 1 &&
            permiso.opcion_label === 'Productos'
          ) {
            this.per_editar = permiso.per_editar;
         
            
          }
        });
      }

      await this.listProductos();
    } catch (error) {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al obtener el rol del usuario.',
      });
    }
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
      || product.codigo_producto.toLowerCase().includes(lowerQuery)
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

  get estadoBoolean(): boolean {
    return this.selectedProduct ? this.selectedProduct.estado_producto === 1 : false;
  }

  set estadoBoolean(value: boolean) {
    if (this.selectedProduct) {
      this.selectedProduct.estado_producto = value ? 1 : 0;
    }
  }

  private createNewProduct(): Product {
    // Obtener el último producto ordenando por el campo codigo_producto
    const lastProduct = this.listProduct.sort((a, b) =>
      a.codigo_producto > b.codigo_producto ? -1 : 1
    )[0];
  
    // Determinar el último código de producto y calcular el siguiente código
    const lastCode = lastProduct ? lastProduct.codigo_producto : '000';
    const nextCode = (parseInt(lastCode, 10) + 1).toString().padStart(3, '0');
  
    return {
      id: 0,
      codigo_producto: nextCode, // Asignar el siguiente código
      nombre_producto: '',
      fecha_producto: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      hora_producto: formatDate(new Date(), 'HH:mm', 'en-US'),
      stock_producto: 0,
      cantidad: 0,
      estado_producto: 0,
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
          const res = await this.srvDelete
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

        // La lógica del estado ahora depende del estado del switch
  if (!this.estadoBoolean) {
    this.selectedProduct!.estado_producto = 0;
  } else if (this.selectedProduct!.stock_producto > 0) {
    this.selectedProduct!.estado_producto = 1;
  } else if (this.selectedProduct!.stock_producto <= 0) {
    this.selectedProduct!.estado_producto = 0;
  } else if (this.estadoBoolean) {
    this.selectedProduct!.estado_producto = 1;
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
