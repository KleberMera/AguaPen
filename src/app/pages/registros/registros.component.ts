import { Component, inject, OnInit } from '@angular/core';
import { RegisterDetailsService } from '../../services/register-details.service';
import { ConfirmationService, MessageService } from 'primeng/api';
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
];

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [PRIMEMG_MODULES],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss',
  providers: [MessageService, ConfirmationService],
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
  loading: boolean = false; // Estado de carga

  constructor() {}
  private srvRegDet = inject(RegisterDetailsService);
  private srvList = inject(ListService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.getListUsuarios();
    this.getListProductos();
  }

  getListUsuarios() {
    this.srvList.getListUsuarios().subscribe((res: any) => {
      this.ListUsers = res.data;
      this.filteredUsers = this.ListUsers;
      this.dropdownOptions = this.ListUsers;
    });
  }

  getListProductos() {
    this.srvList.getListProductos().subscribe((res: any) => {
      this.ListProductos = res.data.map((product: Product) => ({
        ...product,
        cantidad: 1, // Inicializar cantidad a 1
      }));
      console.log('Listado de productos:', this.ListProductos);
    });
  }

  searchUser() {
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = this.ListUsers;
      this.messageService.add({
        severity: 'info',
        summary: 'Búsqueda vacía',
        detail: 'Mostrando todos los usuarios',
      });
      return;
    }

    this.filteredUsers = this.ListUsers.filter(
      (user) =>
        user.tx_cedula &&
        user.tx_cedula.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (this.filteredUsers.length > 0) {
      this.selectedUser = this.filteredUsers[0];
      this.messageService.add({
        severity: 'success',
        summary: 'Usuario encontrado',
        detail: `Se encontraron ${this.filteredUsers.length} usuario(s)`,
      });
    } else {
      this.selectedUser = null;
      this.messageService.add({
        severity: 'error',
        summary: 'Usuario no encontrado',
        detail: 'No se encontraron usuarios con ese criterio de búsqueda',
      });
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredUsers = this.ListUsers;
    this.selectedUser = null;
  }

  selectUser(event: any) {
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

  toggleProducts() {
    this.showProductsTable = !this.showProductsTable;
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

  addProduct(producto: Product) {
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

  register() {
    if (!this.selectedUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: 'Debe seleccionar un usuario antes de registrar',
      });
      return;
    }

    this.loading = true; // Mostrar pantalla de carga

    const registro: Registro = {
      id_usuario: this.selectedUser!.id_usuario,
      observacion: '', // Puedes agregar la observación si la tienes disponible
    };

    console.log('Registro a realizar:', registro);

    this.srvRegDet.postRegisterRegistro(registro).subscribe((res: any) => {
      if (res.id) {
        const id_registro = res.id;
        const detallesRegistro: DetalleRegistro[] = this.selectedProducts.map(
          (prod) => ({
            id_registro: id_registro,
            id_producto: prod.id,
            cantidad: prod.cantidad!,
          })
        );

        console.log('Detalles del registro:', detallesRegistro);
        this.guardarDetallesRegistro(detallesRegistro);
      } else {
        this.loading = false; // Ocultar pantalla de carga
        this.messageService.add({
          severity: 'error',
          summary: 'Error de registro',
          detail: res.mensaje || 'Error al registrar el usuario',
        });
      }
    });
  }

  guardarDetallesRegistro(detalleRegistro: DetalleRegistro[]) {
    console.log('Detalles del registro:', detalleRegistro);

    let completedRequests = 0;

    detalleRegistro.forEach((detalle) => {
      this.srvRegDet
        .postRegisterRegistroDetalle(detalle)
        .subscribe((res: any) => {
          completedRequests++;

          if (completedRequests === detalleRegistro.length) {
            this.loading = false; // Ocultar pantalla de carga

            this.messageService.add({
              severity: 'success',
              summary: 'Registro exitoso',
              detail: 'Todos los registros fueron registrados exitosamente',
            });

            this.getListProductos();
          }
        });
    });
  }
}
