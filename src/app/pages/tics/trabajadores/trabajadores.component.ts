// Imports of Angular
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListService } from '../../../services/services_sg/list.service';

// Services and interfaces of the app
import { RegisterService } from '../../../services/services_sg/register.service';
import { User } from '../../../interfaces/users.interfaces';

// Imports of PrimeNG
import { PRIMENG_MODULES } from './trabajadores.import';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DeleteService } from '../../../services/services_sg/delete.service';

import { PermisosService } from '../../../services/services_auth/permisos.service';
import { AuthService } from '../../../services/services_auth/auth.service';

@Component({
  selector: 'app-usuarios-trabajadores',
  standalone: true,
  imports: [PRIMENG_MODULES, FormsModule],
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export default class UsuariosTrabajadoresComponent implements OnInit {
  loadingSave: boolean = false;
  dialogVisible: boolean = false;
  checked: boolean = false;

  ListUsersWorkers: User[] = [];
  searchTerm: string = '';
  selectedArea: string = '';
  selectedCargo: string = '';
  loading: boolean = true;

  areaOptions: any[] = [];
  cargoOptions: any[] = [];
  filteredCargoOptions: any[] = [];
  per_editar: number = 0;

  currentUser: User = this.createEmptyUser();

  private srvList = inject(ListService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);
  private srvReg = inject(RegisterService);
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
            permiso.modulo_id === 2 &&
            permiso.opcion_label === 'Trabajadores'
          ) {
            this.per_editar = permiso.per_editar;
          }
        });
      }

      this.getListUsuarios();
    } catch (error) {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al obtener el rol del usuario.',
      });
    }
  }

  createEmptyUser(): User {
    return {
      id: 0,
      tx_nombre: '',
      tx_cedula: '',
      tx_area: '',
      tx_cargo: '',
      dt_status: 0,
      dt_usuario: '',
    };
  }

  get estadoBoolean(): boolean {
    return this.currentUser ? this.currentUser.dt_status === 1 : false;
  }

  set estadoBoolean(value: boolean) {
    if (this.currentUser) {
      this.currentUser.dt_status = value ? 1 : 0;
    }
  }

  async getListUsuarios() {
    this.loading = true;
    try {
      const res = await this.srvList.getListUsuarios().toPromise();
      this.ListUsersWorkers = res.data;
      this.areaOptions = this.getUniqueOptions(res.data, 'tx_area');
      this.cargoOptions = this.getUniqueOptions(res.data, 'tx_cargo');
      this.filteredCargoOptions = this.cargoOptions;
    } catch (error) {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al cargar los usuarios.',
      });
    } finally {
      this.loading = false;
    }
  }

  filterUsers(query: string, area: string, cargo: string): User[] {
    const lowerQuery = query.toLowerCase();
    return this.ListUsersWorkers.filter((user) => {
      const matchName = user.tx_nombre?.toLowerCase().includes(lowerQuery);
      const matchCedula = user.tx_cedula?.toLowerCase().includes(lowerQuery);
      const matchArea = !area || user.tx_area === area;
      const matchCargo = !cargo || user.tx_cargo === cargo;
      return (matchName || matchCedula) && matchArea && matchCargo;
    });
  }

  getUniqueOptions(data: any[], field: string): any[] {
    return [...new Set(data.map((item) => item[field]))]
      .filter((value) => value != null)
      .map((value) => ({ label: value, value }))
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
    this.loadingSave = false; // Reiniciar el estado de loadingSave
    if (user) {
      this.currentUser = { ...user };
    } else {
      this.currentUser = this.createEmptyUser();
    }
    this.dialogVisible = true;
  }

  async saveUser() {
    console.log(this.currentUser);

    if (this.validateUser(this.currentUser)) {
      this.loadingSave = true;
      try {
        if (this.currentUser.id > 0) {
          await this.updateUser(this.currentUser);
        } else {
          await this.createUser(this.currentUser);
        }
        this.dialogVisible = false;
        this.getListUsuarios();
      } catch (error) {
        this.handleError(error, 'Error al guardar usuario');
      } finally {
        this.loadingSave = false;
      }
    }
  }

  validateUser(user: User): boolean {
    const requiredFields = ['tx_nombre', 'tx_cedula', 'tx_area', 'tx_cargo'];
    for (const field of requiredFields) {
      if (!user[field as keyof User]) {
        this.srvMensajes.add({
          severity: 'error',
          summary: 'Error',
          detail: `${field.replace('tx_', '')} es obligatorio.`,
        });
        return false;
      }
    }
    return true;
  }

  async createUser(user: User) {
    try {
      const res = await this.srvReg.postRegisterUsers(user).toPromise();
      this.handleResponse(res, 'Creación');
    } catch (error) {
      this.handleError(error, 'Error al crear usuario');
    }
  }

  async updateUser(user: User) {
    try {
      const res = await this.srvReg.postEditUsers(user).toPromise();
      this.handleResponse(res, 'Actualización');
    } catch (error) {
      this.handleError(error, 'Error al actualizar usuario');
    }
  }

  onAreaChange() {
    if (this.selectedArea) {
      this.filteredCargoOptions = this.ListUsersWorkers.filter(
        (user) => user.tx_area === this.selectedArea
      ).map((user) => ({
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
    this.srvMensajes.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al procesar la solicitud',
    });
    this.loading = false;
    this.loadingSave = false;
  }

  deleteUsers(user: User) {
    this.srvConfirm.confirm({
      message: '¿Está seguro de eliminar el trabajador?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      accept: async () => {
        try {
          const res = await this.srvDelete
            .requestdeleteTrabajadores(user.id)
            .toPromise();
          this.handleResponse(res, 'Eliminado');

          await this.getListUsuarios();
        } catch (error) {
          this.handleError(error, 'Error al eliminar producto');
        }
      },
    });
  }
}
