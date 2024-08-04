import { PrintService } from './../../services/print.service';
import { Component, inject } from '@angular/core';
import { PrimeModules } from './registros-vehiculos.import';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Vehiculo } from '../../interfaces/vehicles.interfaces';
import { Product } from '../../interfaces/products.interfaces';
import { RegisterDetailsService } from '../../services/register-details.service';
import { ListService } from '../../services/list.service';
import { registerVehiculos } from '../../interfaces/registers.interfaces';
import { formatDate } from '@angular/common';
import { detailVehiculos } from '../../interfaces/details.interfaces';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-registros-vehiculos',
  standalone: true,
  imports: [PrimeModules, FormsModule],
  templateUrl: './registros-vehiculos.component.html',
  styleUrl: './registros-vehiculos.component.scss',
  providers: [MessageService,ConfirmationService],
})
export default class RegistrosVehiculosComponent {
  // List of areas and products for the app
  ListVehiculos: Vehiculo[] = [];
  ListProductos: Product[] = [];
  filteredVehiculos: Vehiculo[] = [];
  selectedProducts: Product[] = [];
  selectedVehiculo: Vehiculo | null = null;
  dropdownOptions: Vehiculo[] = [];

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
  private PrintService = inject(PrintService);
  private ConfirmationService = inject(ConfirmationService);
  async ngOnInit(): Promise<void> {
    await this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {
    try {
      this.loading = true;
      this.loadingMessage = 'Cargando datos...';
      await Promise.all([this.getListVehiculos(), this.getListProductos()]);
    } finally {
      this.loading = false;
    }
  }

  async getListVehiculos(): Promise<void> {
    try {
      const res = await this.srvList.getListVehiculos().toPromise();
      this.ListVehiculos = res.data;
      this.filteredVehiculos = this.ListVehiculos;
      this.dropdownOptions = this.ListVehiculos;
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
      this.ListProductos = res.data.filter((product: Product) => product.estado_producto === 1 && product.stock_producto > 0).map((product: Product) => ({
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
    this.filteredVehiculos = this.searchQuery.trim()
      ? this.ListVehiculos.filter((vehiculo) =>
          vehiculo.placa?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      : this.ListVehiculos;

    this.messageService.add({
      severity: this.filteredVehiculos.length ? 'success' : 'error',
      summary: this.filteredVehiculos.length
        ? 'Vehiculo encontrado'
        : 'Vehiculo no encontrado',

      detail: this.filteredVehiculos.length
        ? `Se encontraron ${this.filteredVehiculos.length} vehiculo(s)`
        : 'No se encontraron areas con ese criterio de búsqueda',
    });

    this.selectedVehiculo = this.filteredVehiculos[0] || null;
  }

  // function to select an area
  selectVehiculo(event: any): void {
    const vehicles = event.value;
    if (vehicles) {
      this.selectedVehiculo = vehicles;
      this.messageService.add({
        severity: 'info',
        summary: 'Usuario seleccionado',
        detail: `Has seleccionado a ${vehicles.placa}`,
      });
    }
  }

  // function to clear the search query and reset the filtered areas
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredVehiculos = this.ListVehiculos;
    this.selectedVehiculo = null;
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
    if (!this.selectedVehiculo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: 'Debe seleccionar una area antes de registrar',
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
  
    this.MsjAntRegist();  }

  async guardarDetallesRegistro(): Promise<void> {
    try {
      const res: any = await this.srvRegDet
        .getidlastregistrovehiculos()
        .toPromise();
      const lastRegistroId = res.id_registro_vehiculo;

      const detallesRegistro: detailVehiculos[] = this.selectedProducts.map(
        (prod) => ({
          id_registro_vehiculo: lastRegistroId,
          id_producto: prod.id,
          cantidad: prod.cantidad!,
        })
      );

      const requests = detallesRegistro.map((detalle) =>
        this.srvRegDet.postRegisterDetalleVehiculos(detalle).toPromise()
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
    this.selectedVehiculo = null;
    this.selectedProducts = [];
    this.showProductsTable = false;
    this.ListProductos.forEach((product) => (product.cantidad = 1));
    this.observacion = '';
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


  exportData() {
    this.PrintService.exportAsigVehicle(this.selectedVehiculo, this.selectedProducts, this.observacion);
  }
private mensajeDeDescarga(): void {
  if (!this.selectedProducts.length) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error de exportación',
      detail: 'No hay productos seleccionados para exportar.',
    });
    return;
  }
  this.ConfirmationService.confirm({
    message: '¿Deseas exportar los datos a PDF?',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      // Llama a la función para exportar los datos
      await this.exportData();

      // Procede con el registro después de la exportación
      this.procederConRegistro();
    },
    reject: () => {
      this.procederConRegistro();
    }
  });
}


private async procederConRegistro(): Promise<void> {
  if (!this.selectedVehiculo) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error de registro',
      detail: 'No hay vehiculo seleccionado para el registro.',
    });
    return;
  }

  this.loading = true;
  this.loadingMessage = 'Registrando Datos, espere un momento...';

  try {
    // Asegúrate de que selectedUser no sea null antes de acceder a sus propiedades
    const registro: registerVehiculos = {
      id_vehiculo: this.selectedVehiculo.id,
      fecha_registro: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      hora_registro: formatDate(new Date(), 'HH:mm', 'en-US'),
      observacion: this.observacion,
    };

    const res: any = await this.srvRegDet
      .postRegisterVehiculos(registro)
      .toPromise();

    if (res) {
      await this.guardarDetallesRegistro();

      this.clearForm();
      this.messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: 'Se registraron los detalles con éxito',
      });
      await this.getListProductos();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: res.mensaje || 'Error al registrar el vehiculo',
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


MsjAntRegist() {
  this.ConfirmationService.confirm({
    message: '¿Deseas registrar esta asignación?',
    header: 'Confirmación de Registro',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      this.mensajeDeDescarga(); // Llama a la función que maneja la descarga y el registro
    },
    reject: () => {
      // No se hace nada en caso de rechazo
    }
  });
}
}
