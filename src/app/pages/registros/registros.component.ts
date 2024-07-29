import { Component, inject, OnInit } from '@angular/core';
import { RegisterDetailsService } from '../../services/register-details.service';
import { ListService } from '../../services/list.service';
import { MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Registro } from '../../interfaces/registers.interfaces';
import { Product } from '../../interfaces/products.interfaces';

import { PRIMEMG_MODULES } from './registros.imports';
import { User } from '../../interfaces/users.interfaces';
import { details } from '../../interfaces/details.interfaces';

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [PRIMEMG_MODULES, FormsModule],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss',
  providers: [MessageService],
})
export default class RegistrosComponent implements OnInit {
  ListUsers: User[] = [];
  ListProductos: Product[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  selectedUser: User | null = null;
  dropdownOptions: User[] = [];
  showProductsTable: boolean = false;
  selectedProducts: Product[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  observacion: string = '';
  loadingMessage: string = '';
  grid: boolean = false;

  isInProgress: boolean = false;

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
      await Promise.all([this.getListUsuarios(), this.getListProductos()]);
    } finally {
      this.loading = false;
    }
  }

  async getListUsuarios(): Promise<void> {
    try {
      const res = await this.srvList.getListUsuarios().toPromise();
      this.ListUsers = res.data;
      this.filteredUsers = this.ListUsers;
      this.dropdownOptions = this.ListUsers;
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

  searchUser(): void {
    this.filteredUsers = this.searchQuery.trim()
      ? this.ListUsers.filter((user) =>
          user.tx_cedula?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      : this.ListUsers;

    this.messageService.add({
      severity: this.filteredUsers.length ? 'success' : 'error',
      summary: this.filteredUsers.length
        ? 'Usuario encontrado'
        : 'Usuario no encontrado',
      detail: this.filteredUsers.length
        ? `Se encontraron ${this.filteredUsers.length} usuario(s)`
        : 'No se encontraron usuarios con ese criterio de búsqueda',
    });

    this.selectedUser = this.filteredUsers[0] || null;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredUsers = this.ListUsers;
    this.selectedUser = null;
  }

  selectUser(event: any): void {
    const user = event.value;
    if (user) {
      this.selectedUser = user;
      this.messageService.add({
        severity: 'info',
        summary: 'Usuario seleccionado',
        detail: `Has seleccionado a ${user.tx_nombre}`,
      });
    }
  }

  toggleProducts(): void {
    if (this.showProductsTable) {
      this.showProductsTable = false;
      this.isInProgress = false;
    } else {
      this.showProductsTable = true;
      this.isInProgress = true;
    }
  }

  get totalCantidadProductos(): number {
    return this.selectedProducts.reduce(
      (total, product) => total + product.cantidad,
      0
    );
  }

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

  async register(): Promise<void> {
    if (!this.selectedUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: 'Debe seleccionar un usuario antes de registrar',
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
      const registro: Registro = {
        id_usuario: this.selectedUser.id,
        fecha_registro: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
        hora_registro: formatDate(new Date(), 'HH:mm', 'en-US'),
        observacion: this.observacion,
      };

      const res: any = await this.srvRegDet
        .postRegisterRegistro(registro)
        .toPromise();
      if (res) {
        await this.guardarDetallesRegistro();
        this.clearForm();
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se  registraron los detalles con éxito',
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
      const res: any = await this.srvRegDet.getidlasregistro().toPromise();
      const lastRegistroId = res.id_registro;

      const detallesRegistro: details[] = this.selectedProducts.map((prod) => ({
        id_registro: lastRegistroId,
        id_producto: prod.id,
        cantidad: prod.cantidad!,
      }));

      // Registrar todos los detalles del registro
      await Promise.all(
        detallesRegistro.map((detalle) =>
          this.srvRegDet.postRegisterRegistroDetalle(detalle).toPromise()
        )
      );

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

  revertProduct(product: Product): void {
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
      product.cantidad = 0;
    }
  }

  clearForm(): void {
    this.selectedUser = null;
    this.selectedProducts = [];
    this.showProductsTable = false;
    this.ListProductos.forEach((product) => (product.cantidad = 1));
  }

  isProductSelected(product: Product): boolean {
    return this.selectedProducts.some((p) => p.id === product.id);
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

  filterProducts(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.ListProductos.filter((product) =>
      product.nombre_producto.toLowerCase().includes(lowerQuery)
    );
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
