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
  ListUsers: any[] = [];
  ListProductos: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  dropdownOptions: any[] = [];
  showProductsTable: boolean = false;
  selectedProducts: any[] = []; // Arreglo para almacenar los productos seleccionados con cantidad

  constructor(
    private srvRegDet: RegisterDetailsService,
    private srvList: ListService,
    private messageService: MessageService
  ) {}

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
      this.ListProductos = res.data;
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

  addProduct(producto: any) {
    const foundProduct = this.selectedProducts.find(
      (p) => p.id_producto === producto.id_producto
    );

    if (foundProduct) {
      // Si el producto ya está en la lista, actualiza la cantidad
      foundProduct.cantidad += producto.cantidad;
    } else {
      // Si no está en la lista, agrégalo con su cantidad
      this.selectedProducts.push({
        id_producto: producto.id,
        cantidad: producto.cantidad,
      });
    }

    // Reiniciar la cantidad del producto agregado
    producto.cantidad = 1;
    console.log('Producto añadido:', producto);

    this.messageService.add({
      severity: 'success',
      summary: 'Producto agregado',
      detail: `${producto.nombre_producto} agregado con éxito`,
    });
  }

  removeProduct(producto: any) {
    const index = this.selectedProducts.findIndex(
      (p) => p.id_producto === producto.id_producto
    );

    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
      this.messageService.add({
        severity: 'success',
        summary: 'Producto eliminado',
        detail: `${producto.nombre_producto} eliminado`,
      });
    }
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

    // Primero registramos el registro principal
    const registro = {
      id_usuario: this.selectedUser.id_usuario,
      observacion: '', // Puedes agregar la observación si la tienes disponible
    };

    console.log('Registro a realizar:', registro);

    this.srvRegDet.postRegisterRegistro(registro).subscribe((res: any) => {
      if (res.id) {
        const id_registro = res.id;
        const detallesRegistro = this.selectedProducts.map((prod) => ({
          id_registro: id_registro,
          id_producto: prod.id_producto,
          cantidad: prod.cantidad,
        }));

        console.log('Detalles del registro:', detallesRegistro);
        this.guardarDetallesRegistro(detallesRegistro);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de registro',
          detail: res.mensaje || 'Error al registrar el usuario',
        });
      }
    });
  }

  guardarDetallesRegistro(detalleRegistro: any[]) {
    console.log('Detalles del registro:', detalleRegistro);

    detalleRegistro.forEach((destalle) => {
      this.srvRegDet
        .postRegisterRegistroDetalle(destalle)
        .subscribe((res: any) => {
          if (res.retorno == 1) {
            this.messageService.add({
              severity: 'success',
              summary: 'Registro exitoso',
              detail: res.mensaje,
            });
          }
        });
    });
  }
}
