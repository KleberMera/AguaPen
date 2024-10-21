// Imports for Angular
import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { RegisterService } from '../../../services/seguridad-industrial/register.service';
import { ListService } from '../../../services/seguridad-industrial/list.service';
import { PRIMENG_MODULES} from './productos.import';
import { ConfirmationService, MessageService } from 'primeng/api';
import { columnsProducts, fieldsFormsProducts, Product } from '../../../models/products.model';
import { DeleteService } from '../../../services/seguridad-industrial/delete.service';
import { PermisosService } from '../../../services/auth/permisos.service';
import { TableComponent } from '../../../components/data/table/table.component';
import { createProductPayload, ProductForm, updateProductPayload } from '../../../core/payloads/products.payload';
import { SearchComponent } from '../../../components/data/search/search.component';
import { FormsComponent } from "../../../components/data/forms/forms.component";

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, PRIMENG_MODULES, TableComponent, ReactiveFormsModule, SearchComponent, FormsComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class ProductosComponent {
  // Signals
  readonly productForm = signal<FormGroup>(ProductForm());
  readonly columnsProducts = columnsProducts;
  readonly fields = fieldsFormsProducts;
  
  // State
  protected listProduct = signal<Product[]>([]);
  protected searchTerm = signal<string>('');
  protected loading = signal<boolean>(true);
  protected loadingSave = signal<boolean>(false);
  protected dialogVisible = signal<boolean>(false);
  protected per_editar = signal<number>(0);

 // Injected services
  private readonly srvList = inject(ListService);
  private readonly srvReg = inject(RegisterService);
  private readonly srvMensajes = inject(MessageService);
  private readonly srvConfirm = inject(ConfirmationService);
  private readonly srvDelete = inject(DeleteService);
  private readonly srvPermisos = inject(PermisosService);;

 protected onSearchTermChange(term: string): void {
  this.searchTerm.set(term);
}
  ngOnInit() {
    this.getUserRole();
  }

  protected async getUserRole(): Promise<void> {
    try {
      const perEditar = this.srvPermisos.getPermissionEditar('Productos');
      this.per_editar.set(perEditar);
      await this.listProductos();
    } catch (error: unknown) {
      this.handleError(error, 'Error al obtener permisos');
    }
  }
  
  protected async listProductos(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await this.srvList.getlistProducts().toPromise();
      if (response?.data) {
        this.listProduct.set(response.data);
      }
    } catch (error: unknown) {
      this.handleError(error, 'Error al cargar productos');
    } finally {
      this.loading.set(false);
    }
  }

  filterProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.listProduct().filter(
      (product) =>
        product.nombre_producto.toLowerCase().includes(lowerQuery) ||
        product.codigo_producto.toLowerCase().includes(lowerQuery)
    );
  }

  private getNextProductCode(): string {
    const products = this.listProduct();
    if (!products.length) return '001';

    const lastProduct = [...products].sort((a, b) =>
      b.codigo_producto.localeCompare(a.codigo_producto)
    )[0];

    const nextCode = parseInt(lastProduct.codigo_producto, 10) + 1;
    return nextCode.toString().padStart(3, '0');
  }

  openAddProductDialog() {
    this.productForm().reset();
    this.productForm().get('codigo_producto')?.enable();
    const nextCode = this.getNextProductCode();
    this.productForm().patchValue({
      codigo_producto: nextCode,
      fecha_producto: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      hora_producto: formatDate(new Date(), 'HH:mm', 'en-US'),
      estado_producto: 1,
    });
    this.dialogVisible.set(true);
  }

  openEditProductDialog(product: Product) {
    this.dialogVisible.set(true);
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
    const form = this.productForm();
    if (!form.valid) return;
    const nombreProducto = form.get('nombre_producto')?.value?.trim().toLowerCase();
    const currentId = form.get('id')?.value;
    // Busca si existe un producto con el mismo nombre pero diferente ID
    const existingProduct = this.listProduct().find( product =>  product.nombre_producto.toLowerCase() === nombreProducto && 
        product.id !== currentId
    );

    if (existingProduct) {
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un producto con este nombre' });
      return;
    }
  
    this.loadingSave.set(true);
     try {
       currentId  === null ? await this.addProduct() : await this.editProduct();
       this.dialogVisible.set(false);
       await this.listProductos();
     } catch (error: unknown) {
       this.handleError(error, 'Error al guardar el producto');
     } finally {
      this.loadingSave.set(false);
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
    this.loading.set(false);
    this.loadingSave.set(false);
  }

}
