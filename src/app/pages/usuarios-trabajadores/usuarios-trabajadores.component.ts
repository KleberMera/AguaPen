import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ListService } from '../../services/list.service';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from './../../interfaces/register.interfaces';
import { DialogModule, Dialog } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar'; // Importar AvatarModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RegisterService } from '../../services/register.service';

const PRIMENG_MODULES = [
  FieldsetModule,
  CommonModule,
  TableModule,
  ProgressSpinnerModule,
  InputTextModule,
  IconFieldModule,
  InputIconModule,
  DropdownModule,
  ButtonModule,
  ConfirmDialogModule,
  ToastModule,
  DialogModule,
  AvatarModule, // Agregar AvatarModule aquí
];

@Component({
  selector: 'app-usuarios-trabajadores',
  standalone: true,
  imports: [PRIMENG_MODULES, FormsModule],
  templateUrl: './usuarios-trabajadores.component.html',
  styleUrls: ['./usuarios-trabajadores.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export default class UsuariosTrabajadoresComponent implements OnInit {
  loadingSave: boolean = false;
  dialogVisible: boolean = false;
  @ViewChild('userDialog') userDialog!: Dialog;

  ListUsersWorkers: User[] = [];
  searchTerm: string = '';
  selectedArea: string = '';
  selectedCargo: string = '';
  loading: boolean = true;

  areaOptions: any[] = [];
  cargoOptions: any[] = [];
  filteredCargoOptions: any[] = [];

  currentUser: User = {
    id_usuario: 0,
    tx_nombre: '',
    tx_cedula: '',
    tx_area: '',
    tx_cargo: '',
    tx_vehiculo: '',
    tx_vehiculo_descripcion: '',
  };

  selectedUser: User = {
    id_usuario: 0,
    tx_nombre: '',
    tx_cedula: '',
    tx_area: '',
    tx_cargo: '',
    tx_vehiculo: '',
    tx_vehiculo_descripcion: '',
  };

  private srvList = inject(ListService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);
  private srvReg = inject(RegisterService);

  ngOnInit(): void {
    this.getListUsuarios();
  }

  getListUsuarios() {
    this.srvList.getListUsuarios().subscribe(
      (res: any) => {
        this.ListUsersWorkers = res.data;
        this.loading = false;

        this.areaOptions = this.getUniqueOptions(res.data, 'tx_area');
        this.cargoOptions = this.getUniqueOptions(res.data, 'tx_cargo');
        this.filteredCargoOptions = this.cargoOptions;
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    );
  }

  filterUsers(query: string, area: string, cargo: string) {
    const lowerQuery = query.toLowerCase();
    return this.ListUsersWorkers.filter((user) => {
      return (
        (user.tx_nombre?.toLowerCase().includes(lowerQuery) ||
          user.tx_cedula?.toLowerCase().includes(lowerQuery)) &&
        (!area || user.tx_area === area) &&
        (!cargo || user.tx_cargo === cargo)
      );
    });
  }

  getUniqueOptions(data: any[], field: string) {
    return [...new Set(data.map((item) => item[field]))]
      .filter((value) => value != null) // Filtra valores nulos o indefinidos
      .map((value) => ({ label: value, value: value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  clearSearchTerm() {
    this.searchTerm = '';
  }

  clearSelectedArea() {
    this.selectedArea = '';
    this.filteredCargoOptions = this.cargoOptions;
  }

  clearSelectedCargo() {
    this.selectedCargo = '';
  }

  showDialog(user: User | null) {
    if (user) {
      this.currentUser = { ...user };
      this.userDialog.header = 'Editar Trabajador';
    } else {
      this.currentUser = {
        id_usuario: 0,
        tx_nombre: '',
        tx_cedula: '',
        tx_area: '',
        tx_cargo: '',
        tx_vehiculo: '',
        tx_vehiculo_descripcion: '',
      };
      this.userDialog.header = 'Nuevo Trabajador';
    }
    this.dialogVisible = true;
  }

  saveUser() {
    if (this.validateUser(this.currentUser)) {
      if (this.currentUser.id_usuario && this.currentUser.id_usuario > 0) {
        // Si el ID es mayor a 0, actualiza el usuario
        this.updateUser(this.currentUser);
      } else {
        // Si el ID es 0, crea un nuevo usuario
        this.createUser(this.currentUser);
      }
    }
  }

  validateUser(user: User): boolean {
    if (!user.tx_nombre) {
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio.' });
      return false;
    }
    if (!user.tx_cedula) {
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'La cédula es obligatoria.' });
      return false;
    }
    if (!user.tx_area) {
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'El área es obligatoria.' });
      return false;
    }
    if (!user.tx_cargo) {
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'El cargo es obligatorio.' });
      return false;
    }
    return true;
  }

  createUser(user: User) {
    this.loadingSave = true;
    this.srvReg.postRegisterUsers(user).subscribe({
      next: (response) => {
        this.dialogVisible = false;
        this.getListUsuarios(); // Recarga la lista de usuarios después de crear uno nuevo
        this.srvMensajes.add({ severity: 'success', summary: 'Creación exitosa', detail: 'El nuevo usuario fue creado correctamente.' });
        this.loadingSave = false;
      },
      error: (err) => {
        console.error('Error creando usuario:', err);
        this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al crear el usuario.' });
        this.loadingSave = false;
      }
    });
  }

  updateUser(user: User) {
    this.loadingSave = true;
    this.srvReg.postEditUsers(user).subscribe({
      next: (response) => {
        this.dialogVisible = false;
        this.getListUsuarios(); // Recarga la lista de usuarios después de actualizar
        this.srvMensajes.add({ severity: 'success', summary: 'Actualización exitosa', detail: 'El usuario fue actualizado correctamente.' });
        this.loadingSave = false;
      },
      error: (err) => {
        console.error('Error actualizando usuario:', err);
        this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al actualizar el usuario.' });
        this.loadingSave = false;
      }
    });
  }

  onAreaChange() {
    if (this.selectedArea) {
      this.filteredCargoOptions = this.ListUsersWorkers
        .filter((user) => user.tx_area === this.selectedArea)
        .map((user) => ({
          label: user.tx_cargo,
          value: user.tx_cargo,
        }));

      this.filteredCargoOptions = this.getUniqueOptions(
        this.filteredCargoOptions,
        'label'
      );
    } else {
      this.filteredCargoOptions = this.cargoOptions;
    }
    this.selectedCargo = '';
  }
}
