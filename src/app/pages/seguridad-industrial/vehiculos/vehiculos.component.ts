import { Component, inject, signal } from '@angular/core';
import { PRIMENG_MODULES } from './vehiculos.import';
import { columnsVehiculos, fieldsFormsVehiculos, Vehiculo } from '../../../models/vehicles.model';
import { RegisterService } from '../../../services/seguridad-industrial/register.service';
import { ListService } from '../../../services/seguridad-industrial/list.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormGroup, FormsModule } from '@angular/forms';
import { DeleteService } from '../../../services/seguridad-industrial/delete.service';
import { PermisosService } from '../../../services/auth/permisos.service';
import { SearchComponent } from '../../../components/data/search/search.component';
import { TableComponent } from '../../../components/data/table/table.component';
import { createVehiclePayload, updateVehiclePayload, VehicleForm } from '../../../core/payloads/vehicles.payload';
import { FormsComponent } from '../../../components/data/forms/forms.component';
const COMPONENTS_DATA = [SearchComponent, TableComponent, FormsComponent];
@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [PRIMENG_MODULES, COMPONENTS_DATA, FormsModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class VehiculosComponent {
  //Signals
  readonly vehiclesForm = signal<FormGroup>(VehicleForm());
  readonly columnsVehiculos = columnsVehiculos;
  readonly fields = fieldsFormsVehiculos;

  //State
  protected listVehiculo = signal<Vehiculo[]>([]);
  protected searchTerm = signal<string>('');
  protected loading = signal<boolean>(true);
  protected loadingSave = signal<boolean>(false);
  protected dialogVisible = signal<boolean>(false);
  protected per_editar = signal<number>(0);

  private readonly srvReg = inject(RegisterService);
  private readonly srvList = inject(ListService);
  private readonly srvMensajes = inject(MessageService);
  private readonly srvConfirm = inject(ConfirmationService);
  private readonly srvDelete = inject(DeleteService);
  private readonly srvPermisos = inject(PermisosService);

  protected onSearchTermChange(term: string): void {
    this.searchTerm.set(term);
  }

  ngOnInit(): void {
    this.getUserRole();
  }

  async getUserRole() {
    try {
      const perEditar = this.srvPermisos.getPermissionEditar('Vehiculos');
      this.per_editar.set(perEditar);
      await this.listVehiculos();
    } catch (error: unknown) {
      this.handleError(error, 'Error al obtener permisos');
    }
  }

  private async listVehiculos() {
    this.loading.set(true);
    try {
      const res = await this.srvList.getListVehiculos().toPromise();
      this.listVehiculo.set(res.data)
    } catch (error) {
      this.handleError(error, 'Error al cargar vehículos:');
    } finally {
      this.loading.set(false);
    }
  }

  filterVehiculos(query: string): Vehiculo[] {
    const lowerQuery = query.toLowerCase();
    return this.listVehiculo().filter((vehiculo) =>
      vehiculo.placa.toLowerCase().includes(lowerQuery)
    );
  }

  openAddVehiculoDialog() {
    this.vehiclesForm().reset();
    this.vehiclesForm().patchValue({
      estado : 1,
    });
    this.dialogVisible.set(true);
  }

  openEditVehiculoDialog(vehiculo: Vehiculo) {
    this.dialogVisible.set(true);
    this.vehiclesForm().patchValue({
      ...vehiculo
    });
  }

  async addVehiculo() {
    try {
      const payload = createVehiclePayload(this.vehiclesForm());
      const res = await this.srvReg.postRegisterVehiculos(payload).toPromise();
      this.handleResponse(res, 'Agregado');
    } catch (error) {
      this.handleError(error, 'Error al agregar vehículo');
    }
  }

  async editVehiculo() {
    try {
      const payload = updateVehiclePayload(this.vehiclesForm());
      const res = await this.srvReg.postEditVehiculos(payload).toPromise();
      this.handleResponse(res, 'Editado');
    } catch (error) {
      this.handleError(error, 'Error al editar vehículo');
    }
  }

  deleteVehiculo(vehiculo: Vehiculo) {
    this.srvConfirm.confirm({ message: '¿Está seguro de eliminar el vehículo?', header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      accept: async () => {
        try {
          const res = await this.srvDelete.requestdeleteVehiculos(vehiculo.id).toPromise();
          this.handleResponse(res, 'Eliminado');
          await this.listVehiculos();
        } catch (error) {
          this.handleError(error, 'Error al eliminar vehículo');
        }
      },
    });
  }

  async saveVehiculo() {
    const form = this.vehiclesForm();
    if (!form.valid) return;
    const placa = form.get('placa')?.value?.trim().toLowerCase();
    const currentId = form.get('id')?.value;
    // Busca si existe un vehiculo con el mismo placa pero diferente ID
    const existingVehiculo = this.listVehiculo().find( vehiculo =>  vehiculo.placa.toLowerCase() === placa && 
        vehiculo.id !== currentId
    );
    if (existingVehiculo) {
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un vehiculo con este placa' });
      return;
    }

    this.loadingSave.set(true);
     try {
      
       currentId  === null ? await this.addVehiculo() : await this.editVehiculo();
       this.dialogVisible.set(false);
       await this.listVehiculos();
     } catch (error: unknown) {
       this.handleError(error, 'Error al guardar el producto');
     } finally {
      this.loadingSave.set(false);
     }
  }

  private handleResponse(res: any, successMessage: string) {
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

  private handleError(error: any, message: string): void {
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
