// Imports of Angular
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';

// Services and interfaces of the app
import { registerArea } from '../../interfaces/registers.interfaces';
import { RegisterDetailsService } from '../../services/register-details.service';
import { ListService } from '../../services/list.service';

// Imports of PrimeNG
import { PrimeModules } from './registros-areas.import';
// Providers of PrimeNG
import { MessageService } from 'primeng/api';
import { Product } from '../../interfaces/products.interfaces';
import { detailAreas } from '../../interfaces/details.interfaces';
import { Area } from '../../interfaces/areas.interfaces';

@Component({
  selector: 'app-regx-area',
  standalone: true,
  imports: [PrimeModules, FormsModule],
  templateUrl: './registros-areas.component.html',
  styleUrl: './registros-areas.component.scss',
  providers: [MessageService],
})
export default class RegxAreaComponent {
  // List of areas and products for the app
  ListAreas: Area[] = [];
  ListProductos: Product[] = [];
  filteredAreas: Area[] = [];
  selectedProducts: Product[] = [];
  selectedArea: Area | null = null;
  dropdownOptions: Area[] = [];
  searchQuery: string = '';

  // Loading state
  showProductsTable: boolean = false;
  loading: boolean = false;
  loadingMessage: string = '';

  // Other state
  searchTerm: string = '';
  observacion: string = '';

  // Services injected
  private srvRegDet = inject(RegisterDetailsService);
  private srvList = inject(ListService);
  private messageService = inject(MessageService);

  async ngOnInit(): Promise<void> {
    await this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {
    try {
      this.loading = true;
      this.loadingMessage = 'Cargando datos...';
      await Promise.all([this.getListAreas(), this.getListProductos()]);
    } finally {
      this.loading = false;
    }
  }

  async getListAreas(): Promise<void> {
    try {
      const res = await this.srvList.getListAreas().toPromise();
      this.ListAreas = res.data;
      this.filteredAreas = this.ListAreas;
      this.dropdownOptions = this.ListAreas;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar usuarios',
      });
    }
  }
  async getListProductos(): Promise<void> {
    try {
      const res = await this.srvList.getlistProducts().toPromise();
      this.ListProductos = res.data.map((product: Product) => ({
        ...product,
        cantidad: 1,
      }));
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar productos',
      });
    }
  }

  // fuction to search areas
  searchArea(): void {
    this.filteredAreas = this.searchQuery.trim()
      ? this.ListAreas.filter((area) =>
          area.nombre_area
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        )
      : this.ListAreas;

    this.messageService.add({
      severity: this.filteredAreas.length ? 'success' : 'error',
      summary: this.filteredAreas.length
        ? 'Area encontrado'
        : 'Area no encontrado',
      detail: this.filteredAreas.length
        ? `Se encontraron ${this.filteredAreas.length} area(s)`
        : 'No se encontraron areas con ese criterio de búsqueda',
    });

    this.selectedArea = this.filteredAreas[0] || null;
  }

  // function to select an area
  selectArea(event: any): void {
    const user = event.value;
    if (user) {
      this.selectedArea = user;
      this.messageService.add({
        severity: 'info',
        summary: 'Usuario seleccionado',
        detail: `Has seleccionado a ${user.nombre_area}`,
      });
    }
  }

  // function to clear the search query and reset the filtered areas
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredAreas = this.ListAreas;
    this.selectedArea = null;
  }

  // function to toggle the products table state
  toggleProducts(): void {
    this.showProductsTable = !this.showProductsTable;
  }

  // function to update the quantity of a product
  updateProductQuantity(product: Product, increment: boolean): void {
    const newQuantity = increment ? product.cantidad + 1 : product.cantidad - 1;

    if (newQuantity <= product.stock_producto && newQuantity > 0) {
      product.cantidad = newQuantity;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: increment
          ? 'No puedes agregar más de la cantidad en stock'
          : 'La cantidad no puede ser menor a 1',
      });
    }
  }

  // function to revert a product
  revertProduct(product: Product): void {
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
      product.cantidad = 0;
    }
  }

  // function to decrement the quantity of a product
  decrement(product: Product) {
    if (product.cantidad > 1) {
      product.cantidad--;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La cantidad no puede ser menor a 1',
      });
    }
  }
  // function to increment the quantity of a product
  increment(product: Product) {
    if (product.cantidad < product.stock_producto) {
      product.cantidad++;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No puedes agregar más de la cantidad en stock',
      });
    }
  }

  // function to add a product to the selected products
  addProduct(producto: Product): void {
    const foundProduct = this.selectedProducts.find(
      (p) => p.id === producto.id
    );

    if (foundProduct) {
      foundProduct.cantidad! += producto.cantidad!;
    } else {
      this.selectedProducts.push({ ...producto, cantidad: producto.cantidad });
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Producto agregado',
      detail: `${producto.nombre_producto} agregado con éxito`,
    });
  }

  // function to get the total quantity of products
  get totalCantidadProductos(): number {
    return this.selectedProducts.reduce(
      (total, product) => total + product.cantidad,
      0
    );
  }

  // function to register the selected area
  async register(): Promise<void> {
    if (!this.selectedArea) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: 'Debe seleccionar el Area antes de registrar',
      });
      return;
    }

    if (!this.selectedProducts.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: 'Debe agregar al menos un producto para registrar',
      });
      return;
    }

    this.loading = true;
    this.loadingMessage = 'Registrando Datos, espere un momento...';

    try {
      const registro: registerArea = {
        id_area: this.selectedArea.id,
        fecha_registro: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
        hora_registro: formatDate(new Date(), 'HH:mm', 'en-US'),
        observacion: this.observacion,
      };

      const res: any = await this.srvRegDet
        .postRegisterArea(registro)
        .toPromise();
      if (res) {
        await this.guardarDetallesRegistro();
        this.clearForm();
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Todos los registros fueron registrados exitosamente',
        });
        await this.getListProductos();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de registro',
          detail: res.mensaje || 'Error al registrar el usuario',
        });
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al realizar el registro',
      });
    } finally {
      this.loading = false;
    }
  }

  async guardarDetallesRegistro(): Promise<void> {
    try {
      const res: any = await this.srvRegDet.getidlastregistroarea().toPromise();
      const lastRegistroId = res.id_registro_area;

      const detallesRegistro: detailAreas[] = this.selectedProducts.map(
        (prod) => ({
          id_registro_area: lastRegistroId,
          id_producto: prod.id,
          cantidad: prod.cantidad!,
        })
      );

      const requests = detallesRegistro.map((detalle) =>
        this.srvRegDet.postRegisterDetalleAreas(detalle).toPromise()
      );
      await Promise.all(requests);

      // Actualizar el stock de los productos
      await this.actualizarStockProductos();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al registrar los detalles',
      });
    }
  }

  clearForm(): void {
    this.selectedArea = null;
    this.selectedProducts = [];
    this.showProductsTable = false;
    this.ListProductos.forEach((product) => (product.cantidad = 1));
  }

  filterProducts(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.ListProductos.filter(
      (product) =>
        product.nombre_producto.toLowerCase().includes(lowerQuery) ||
        product.codigo_producto.toLowerCase().includes(lowerQuery)
    );
  }

  isProductSelected(product: Product): boolean {
    return this.selectedProducts.some((p) => p.id === product.id);
  }

  async actualizarStockProductos(): Promise<void> {
    try {
      const updateRequests = this.selectedProducts.map((prod) => {
        const newStock = prod.stock_producto - prod.cantidad!;
        return this.srvRegDet
          .postEditProductos({
            id: prod.id,
            nombre_producto: prod.nombre_producto,
            fecha_producto: prod.fecha_producto,
            hora_producto: prod.hora_producto,
            stock_producto: newStock,
          })
          .toPromise();
      });

      await Promise.all(updateRequests);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar el stock de los productos',
      });
    }
  }
}
