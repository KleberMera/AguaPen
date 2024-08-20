import { Component, inject } from '@angular/core';
import { PRIMENG_MODULES } from './vehiculos.import';
import { Vehiculo } from '../../../interfaces/vehicles.interfaces';
import { RegisterService } from '../../../services/services_sg/register.service';
import { ListService } from '../../../services/services_sg/list.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DeleteService } from '../../../services/services_sg/delete.service';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [PRIMENG_MODULES,FormsModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class VehiculosComponent {
  listVehiculo: Vehiculo[] = [];
  searchTerm: string = '';
  selectedVehiculo: Vehiculo | null = null;
  loading: boolean = true;
  loadingSave: boolean = false;
  dialogVisible: boolean = false;

  private srvReg = inject(RegisterService);
  private srvList = inject(ListService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);
  private srvDelete = inject(DeleteService);

  ngOnInit(): void {
    this.listVehiculos();
  }

  private async listVehiculos() {
    this.loading = true;
    try {
      const res = await this.srvList.getListVehiculos().toPromise();
      this.listVehiculo = res.data;
    } catch (error) {
      this.handleError(error, 'Error al cargar vehículos:');
    } finally {
      this.loading = false;
    }
  }

  filterVehiculos(query: string): Vehiculo[] {
    const lowerQuery = query.toLowerCase();
    return this.listVehiculo.filter((vehiculo) =>
      vehiculo.descripcion.toLowerCase().includes(lowerQuery)
    );
  }

  openAddVehiculoDialog() {
    this.selectedVehiculo = this.createNewVehiculo();
    this.dialogVisible = true;
  }

  openEditVehiculoDialog(vehiculo: Vehiculo) {
    this.selectedVehiculo = { ...vehiculo };
    this.dialogVisible = true;
  }

  private createNewVehiculo(): Vehiculo {
    return {
      id: 0,
      placa: '',
      tipo: '',
      descripcion: '',
    };
  }

  private async addVehiculo() {
    if (!this.validateVehiculo()) return;
    try {
      const res = await this.srvReg
        .postRegisterVehiculos(this.selectedVehiculo!)
        .toPromise();
      this.handleResponse(res, 'Agregado');
    } catch (error) {
      this.handleError(error, 'Error al agregar vehículo');
    }
  }

  private async editVehiculo() {
    if (!this.validateVehiculo()) return;
    try {
      const res = await this.srvReg
        .postEditVehiculos(this.selectedVehiculo!)
        .toPromise();
      this.handleResponse(res, 'Editado');
    } catch (error) {
      this.handleError(error, 'Error al editar vehículo');
    }
  }

  deleteVehiculo(vehiculo: Vehiculo) {
    this.srvConfirm.confirm({
      message: '¿Está seguro de eliminar el vehículo?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      accept: async () => {
        try {
          const res = await this.srvDelete
            .requestdeleteVehiculos(vehiculo.id)
            .toPromise();
          this.handleResponse(res, 'Eliminado');
          await this.listVehiculos();
        } catch (error) {
          this.handleError(error, 'Error al eliminar vehículo');
        }
      },
    });
  }

  async saveVehiculo() {
    if (!this.selectedVehiculo) return;

    this.loadingSave = true;
    try {
      this.selectedVehiculo.id === 0
        ? await this.addVehiculo()
        : await this.editVehiculo();
      this.dialogVisible = false;
      await this.listVehiculos();
    } catch (error) {
      this.handleError(error, 'Error al guardar el vehículo');
    } finally {
      this.loadingSave = false;
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

  private validateVehiculo(): boolean {
    if (
      this.selectedVehiculo!.placa.trim() === '' ||
      this.selectedVehiculo!.descripcion.trim() === ''
    ) {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La placa y la descripción son obligatorias',
      });
      return false;
    }

    return true;
  }

  private handleError(error: any, message: string): void {
    console.error(message, error);
    this.srvMensajes.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al procesar la solicitud',
    });
    this.loading = false;
    this.loadingSave = false;
  }
}
