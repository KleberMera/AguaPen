// Imports of Angular
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ListService } from '../../../services/seguridad-industrial/list.service';

// Services and interfaces of the app
import { RegisterService } from '../../../services/seguridad-industrial/register.service';

// Imports of PrimeNG
import { PRIMENG_MODULES } from './trabajadores.import';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DeleteService } from '../../../services/seguridad-industrial/delete.service';

import { PermisosService } from '../../../services/auth/permisos.service';
import { AuthService } from '../../../services/auth/auth.service';

import {
  createWorkerPayload,
  updateWorkerPayload,
  WorkerForm,
} from '../../../core/payloads/workers.payload';
import { SearchComponent } from '../../../components/data/search/search.component';
import { TableComponent } from '../../../components/data/table/table.component';
import {
  columnsWorker,
  fieldsFormsWorker,
  Worker,
} from '../../../models/workers.model';
import { FormsComponent } from '../../../components/data/forms/forms.component';

@Component({
  selector: 'app-usuarios-trabajadores',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    FormsModule,
    SearchComponent,
    TableComponent,
    FormsComponent,
  ],
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export default class UsuariosTrabajadoresComponent implements OnInit {
  readonly workerForm = signal<FormGroup>(WorkerForm());
  readonly columnsWorker = columnsWorker;
  readonly fields = fieldsFormsWorker;

  protected listWorker = signal<Worker[]>([]);
  protected searchTerm = signal<string>('');
  protected loading = signal<boolean>(true);
  protected loadingSave = signal<boolean>(false);
  protected dialogVisible = signal<boolean>(false);
  protected selectedCargo = signal<string>('');
  protected selectedArea = signal<string>('');
  protected per_editar = signal<number>(0);
  protected areaOptions = signal<any[]>([]);
  protected cargoOptions = signal<any[]>([]);
  protected filteredCargoOptions = signal<any[]>([]);

  private readonly srvList = inject(ListService);
  private readonly srvMensajes = inject(MessageService);
  private readonly srvConfirm = inject(ConfirmationService);
  private readonly srvReg = inject(RegisterService);
  private readonly srvDelete = inject(DeleteService);
  private readonly srvPermisos = inject(PermisosService);

  protected onSearchTermChange(term: string): void {
    this.searchTerm.set(term);
  }
  ngOnInit(): void {
    this.getUserRole();
  }

  getUniqueOptions(data: any[], field: string): any[] {
    return [...new Set(data.map((item) => item[field]))]
      .filter((value) => value != null)
      .map((value) => ({ label: value, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  async getListUsuarios() {
    this.loading.set(true);
    try {
      const res = await this.srvList.getListUsuarios().toPromise();
      this.listWorker.set(res.data);
      this.areaOptions.set(this.getUniqueOptions(res.data, 'tx_area'));
      this.cargoOptions.set(this.getUniqueOptions(res.data, 'tx_cargo'));
      this.filteredCargoOptions.set(this.cargoOptions());
    } catch (error: unknown) {
      this.handleError(error, 'Error al cargar productos');
    } finally {
      this.loading.set(false);
    }
  }

  async getUserRole() {
    try {
      const perEditar = this.srvPermisos.getPermissionEditar('Trabajadores');
      this.per_editar.set(perEditar);
      await this.getListUsuarios();
    } catch (error: unknown) {
      this.handleError(error, 'Error al obtener permisos');
    }
  }

  filterUsers(query: string, area: string, cargo: string): Worker[] {
    const lowerQuery = query.toLowerCase();
    return this.listWorker().filter((user) => {
      const matchName = user.tx_nombre?.toLowerCase().includes(lowerQuery);
      const matchCedula = user.tx_cedula?.toLowerCase().includes(lowerQuery);
      const matchArea = !area || user.tx_area === area;
      const matchCargo = !cargo || user.tx_cargo === cargo;
      return (matchName || matchCedula) && matchArea && matchCargo;
    });
  }

  openAddWorkerDialog() {
    this.workerForm().reset();
    this.workerForm().patchValue({ dt_status: 1,});
    this.dialogVisible.set(true);
  }

  openEditWorkerDialog(workER: Worker) {
    this.dialogVisible.set(true);
    this.workerForm().patchValue({...workER,});
  }

  async createUser() {
    try {
      const payload = createWorkerPayload(this.workerForm());
      const res = await this.srvReg.postRegisterUsers(payload).toPromise();
      this.handleResponse(res, 'Creación');
    } catch (error) {
      this.handleError(error, 'Error al crear usuario');
    }
  }

  async updateUser() {
    try {
      const payload = updateWorkerPayload(this.workerForm());
      const res = await this.srvReg.postEditUsers(payload).toPromise();
      this.handleResponse(res, 'Actualización');
    } catch (error) {
      this.handleError(error, 'Error al actualizar usuario');
    }
  }

  deleteUsers(user: Worker) {
    this.srvConfirm.confirm({
      message: '¿Está seguro de eliminar el trabajador?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      accept: async () => {
        try {
          const res = await this.srvDelete.requestdeleteTrabajadores(user.id).toPromise();
          this.handleResponse(res, 'Eliminado');
          await this.getListUsuarios();
        } catch (error) {
          this.handleError(error, 'Error al eliminar producto');
        }
      },
    });
  }

  async saveWorker() {
    const form = this.workerForm();
    if (!form.valid) return;

    const tx_cedula = form.get('tx_cedula')?.value?.trim().toLowerCase();
    const dt_usuario = form.get('dt_usuario')?.value?.trim().toLowerCase(); // Obtener el valor de dt_usuario
    const currentId = form.get('id')?.value;

    // Busca si existe un trabajador con el mismo tx_cedula pero diferente ID
    const existingWorkerByCedula = this.listWorker().find(
      (worker) => worker.tx_cedula && worker.tx_cedula.toLowerCase() === tx_cedula && worker.id !== currentId);

    if (existingWorkerByCedula) {
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un trabajador con esta cédula'});
      return;
    }

    // Busca si existe un trabajador con el mismo dt_usuario pero diferente ID
    const existingWorkerByUsuario = this.listWorker().find(
      (worker) => worker.dt_usuario && worker.dt_usuario.toLowerCase() === dt_usuario && worker.id !== currentId);

    if (existingWorkerByUsuario) {
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un trabajador con este usuario',});
      return;
    }

    this.loadingSave.set(true);
    try {
      currentId === null ? await this.createUser() : await this.updateUser();
      this.dialogVisible.set(false);
      await this.getListUsuarios();
    } catch (error: unknown) {
      this.handleError(error, 'Error al guardar el trabajador');
    } finally {
      this.loadingSave.set(false);
    }
  }

  handleError(error: unknown, message: string): void {
    this.srvMensajes.add({ severity: 'error',summary: 'Error', detail: 'Ocurrió un error al procesar la solicitud', });
    this.loading.set(false);
    this.loadingSave.set(false);
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

  onAreaChange() {
    const selectedAreaValue = this.selectedArea();
    if (selectedAreaValue) {
      const filteredOptions = this.listWorker().filter((user) => user.tx_area === selectedAreaValue)
        .map((user) => ({ label: user.tx_cargo, value: user.tx_cargo, }));
      this.filteredCargoOptions.set(this.getUniqueOptions(filteredOptions, 'label'));
    } else {
      this.filteredCargoOptions.set(this.cargoOptions());
    }
    this.selectedCargo.set('');
  }
}
