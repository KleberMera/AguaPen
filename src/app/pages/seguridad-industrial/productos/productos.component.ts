// Imports for Angular
import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { RegisterService } from '../../../services/services_sg/register.service';
import { ListService } from '../../../services/services_sg/list.service';
import { PRIMENG_MODULES} from './productos.import';
import { ConfirmationService, MessageService } from 'primeng/api';
import { columnsProducts, Product } from '../../../models/products.interfaces';
import { DeleteService } from '../../../services/services_sg/delete.service';
import { PermisosService } from '../../../services/services_auth/permisos.service';
import { TableComponent } from '../../../components/data/table/table.component';
import { createProductPayload, ProductForm, updateProductPayload } from '../../../core/payloads/products.payload';
import { DialogComponent } from '../../../components/data/dialog/dialog.component';
import { SearchComponent } from '../../../components/data/search/search.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule,PRIMENG_MODULES,TableComponent,ReactiveFormsModule,CommonModule, DialogComponent, SearchComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class ProductosComponent {
  productForm = signal<FormGroup>(ProductForm());
  columnsProducts = columnsProducts;
  // List of products
  listProduct: Product[] = [];
  searchTerm: string = '';
  selectedProduct!: Product;
  // Loading state
  loading: boolean = true;
  loadingSave: boolean = false;
  dialogVisible: boolean = false;
  per_editar!: number;
  // Services injected
  private srvList = inject(ListService);
  private srvReg = inject(RegisterService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);
  private srvDelete = inject(DeleteService);
  private srvPermisos = inject(PermisosService);

  onSearchTermChange(searchTerm: string) {
    this.searchTerm = searchTerm;
  }
  
  ngOnInit() {
    this.getUserRole();
  }

  async getUserRole() {
    try {
      const per_editar = this.srvPermisos.getPermissionEditar('Productos');
      this.per_editar = per_editar;
      await this.listProductos();
    } catch (err: any) {
      console.error(err.error);
    }
  }

  async listProductos() {
    this.loading = true;
    try {
      const res = await this.srvList.getlistProducts().toPromise();
      this.listProduct = res.data;
      this.loading = false;
    } catch (error) {
      this.handleError(error, 'Error al cargar productos:');
      this.loading = false;
    }
  }

  filterProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.listProduct.filter(
      (product) =>
        product.nombre_producto.toLowerCase().includes(lowerQuery) ||
        product.codigo_producto.toLowerCase().includes(lowerQuery)
    );
  }

  getNextProductCode(): string {
    const lastProduct = this.listProduct.sort((a, b) =>
      a.codigo_producto > b.codigo_producto ? -1 : 1
    )[0];

    const lastCode = lastProduct ? lastProduct.codigo_producto : '000';
    return (parseInt(lastCode, 10) + 1).toString().padStart(3, '0');
  }

  openAddProductDialog() {
    this.dialogVisible = true;
    this.productForm().reset();
    this.productForm().get('codigo_producto')?.enable();
    const nextCode = this.getNextProductCode();
    this.productForm().patchValue({
      codigo_producto: nextCode,
      fecha_producto: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      hora_producto: formatDate(new Date(), 'HH:mm', 'en-US'),
      estado_producto: 1,
    });
    
  }

  openEditProductDialog(product: Product) {
    this.dialogVisible = true;
    this.productForm().patchValue({
      ...product, hora_producto: formatDate(new Date(), 'HH:mm', 'en-US'), // Asignar hora actual
    });
    
  }

  async addProduct() {
    try {
      const payload = createProductPayload(this.productForm());
      const res = await this.srvReg.postRegisterProducts(payload).toPromise();
      this.handleResponse(res, 'Agregado');
    } catch (error) {
      this.handleError(error, 'Error al agregar producto');
    }
  }

  async editProduct() {
    try {
      const payload = updateProductPayload(this.productForm());
      const res = await this.srvReg.postEditProducts(payload).toPromise();
      this.handleResponse(res, 'Editado');
    } catch (error) {
      this.handleError(error, 'Error al editar producto');
    }
  }

  deleteProduct(product: Product) {
    this.srvConfirm.confirm({ message: '¿Está seguro de eliminar el producto?', header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      accept: async () => {
        try {
          const res = await this.srvDelete.requestdeleteProducts(product.id).toPromise();
          this.handleResponse(res, 'Eliminado');
          await this.listProductos();
        } catch (error) {
          this.handleError(error, 'Error al eliminar producto');
        }
      },
    });
  }

  async saveProduct() {
    if(!this.productForm().valid) return;
     this.loadingSave = true;
     try {
       this.productForm().get('id')?.value === null ? await this.addProduct() : await this.editProduct();
       this.dialogVisible = false;
       await this.listProductos();
     } catch (error) {
       this.handleError(error, 'Error al guardar el producto');
     } finally {
       this.loadingSave = false;
     }
  }

  handleResponse(res: any, successMessage: string) {
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

  handleError(error: any, message: string): void {
    console.error(message, error);
    this.srvMensajes.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al procesar la solicitud',
    });
    this.loading = false;
    this.loadingSave = false;
  }

  toggleEstado() {
    const currentValue = this.productForm().get('estado_producto')?.value;
    this.productForm().patchValue({
      estado_producto: currentValue ? 0 : 1, // Cambia de 1 a 0 o de 0 a 1
    });
  }
  
}
