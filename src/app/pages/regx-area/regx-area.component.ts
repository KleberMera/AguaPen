import { Component, inject, OnInit } from '@angular/core';
import { RegisterDetailsService } from '../../services/register-details.service';
import { MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { ListService } from '../../services/list.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { SpinnerModule } from 'primeng/spinner';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  DetalleRegistro,
  Product,
  Registro,
  User,
  Registro_Area,
  AREAS,
  DetalleRegistrode_AREA,
  
} from '../../interfaces/register.interfaces';
const PRIMEMG_MODULES = [
  FieldsetModule,
  TableModule,
  ButtonModule,
  FormsModule,
  InputIconModule,
  InputTextModule,
  ToastModule,
  AutoCompleteModule,
  IconFieldModule,
  DropdownModule,
  CardModule,
  BlockUIModule,
  SpinnerModule,
  ProgressSpinnerModule,
  TableModule,
  ButtonModule,
];

@Component({
  selector: 'app-regx-area',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './regx-area.component.html',
  styleUrl: './regx-area.component.scss',
  providers: [MessageService],
})
export default class RegxAreaComponent {
  ListAreas: AREAS [] = [];
  ListProductos: Product[] = [];
  filteredAreas: AREAS[] = [];
  searchQuery: string = '';
  selectedArea: AREAS | null = null;
  dropdownOptions: AREAS[] = [];
  showProductsTable: boolean = false;
  selectedProducts: Product[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  observacion: string = '';
  loadingMessage: string = '';

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
      const res = await this.srvList.getviewAreas().toPromise();
      this.ListAreas = res.data;
      this.filteredAreas = this.ListAreas;
      this.dropdownOptions = this.ListAreas;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar usuarios' });
    }
  }
  async getListProductos(): Promise<void> {
    try {
      const res = await this.srvList.getListProductos().toPromise();
      this.ListProductos = res.data.map((product: Product) => ({ ...product, cantidad: 1 }));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar productos' });
    }
  }



  
  searchArea(): void {
    this.filteredAreas = this.searchQuery.trim()
      ? this.ListAreas.filter(area =>
          area.nombre_area?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      : this.ListAreas;

    this.messageService.add({
      severity: this.filteredAreas.length ? 'success' : 'error',
      summary: this.filteredAreas.length ? 'Area encontrado' : 'Area no encontrado',
      detail: this.filteredAreas.length
        ? `Se encontraron ${this.filteredAreas.length} area(s)`
        : 'No se encontraron areas con ese criterio de búsqueda',
    });

    this.selectedArea = this.filteredAreas[0] || null;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredAreas = this.ListAreas;
    this.selectedArea = null;
  }

  selectArea(event: any): void {
    const user = event.value;
    if (user) {
      this.selectedArea = user;
      this.messageService.add({ severity: 'info', summary: 'Usuario seleccionado', detail: `Has seleccionado a ${user.tx_nombre}` });
    }
  }

  toggleProducts(): void {
    this.showProductsTable = !this.showProductsTable;
  }

  updateProductQuantity(product: Product, increment: boolean): void {
    const newQuantity = increment ? product.cantidad + 1 : product.cantidad - 1;

    if (newQuantity <= product.stock_producto && newQuantity > 0) {
      product.cantidad = newQuantity;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: increment ? 'No puedes agregar más de la cantidad en stock' : 'La cantidad no puede ser menor a 1',
      });
    }
  }
  addProduct(producto: Product): void {
    const foundProduct = this.selectedProducts.find(p => p.id === producto.id);

    if (foundProduct) {
      foundProduct.cantidad! += producto.cantidad!;
    } else {
      this.selectedProducts.push({ ...producto, cantidad: producto.cantidad });
    }

    this.messageService.add({ severity: 'success', summary: 'Producto agregado', detail: `${producto.nombre_producto} agregado con éxito` });
  }

  async register(): Promise<void> {
    if (!this.selectedArea) {
      this.messageService.add({ severity: 'error', summary: 'Error de registro', detail: 'Debe seleccionar el Area antes de registrar' });
      return;
    }

    if (!this.selectedProducts.length) {
      this.messageService.add({ severity: 'error', summary: 'Error de registro', detail: 'Debe agregar al menos un producto para registrar' });
      return;
    }

    this.loading = true;
    this.loadingMessage = 'Registrando Datos, espere un momento...';

    try {
      const registro: Registro_Area = {
        id_area: this.selectedArea.id,
        observacion: this.observacion,
      };

      const res : any = await this.srvRegDet.RegArea(registro).toPromise();
      if (res.id) {
        await this.guardarDetallesRegistro(res.id);
        this.clearForm();
        this.messageService.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Todos los registros fueron registrados exitosamente' });
        await this.getListProductos();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error de registro', detail: res.mensaje || 'Error al registrar el usuario' });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al realizar el registro' });
    } finally {
      this.loading = false;
    }
  }

  async guardarDetallesRegistro(id_registro_a: number): Promise<void> {
    const detallesRegistro: DetalleRegistrode_AREA[] = this.selectedProducts.map(prod => ({
      id_registro_a: id_registro_a,
      id_producto: prod.id,
      cantidad: prod.cantidad!,
    }));

    const requests = detallesRegistro.map(detalle => this.srvRegDet.RegDetalleAreas(detalle).toPromise());
    await Promise.all(requests);
  }


  clearForm(): void {
    this.selectedArea = null;
    this.selectedProducts = [];
    this.showProductsTable = false;
    this.ListProductos.forEach(product => (product.cantidad = 1));
  }




filterProducts(query: string) {
  const lowerQuery = query.toLowerCase();
  return this.ListProductos.filter((product) =>
    product.nombre_producto.toLowerCase().includes(lowerQuery)
  );
}

isProductSelected(product: Product): boolean {
  return this.selectedProducts.some(p => p.id === product.id);
}

revertProduct(product: Product): void {
  const index = this.selectedProducts.findIndex(p => p.id === product.id);
  if (index !== -1) {
    this.selectedProducts.splice(index, 1);
    product.cantidad = 0;
  }
}

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

}