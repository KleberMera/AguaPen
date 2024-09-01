import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Area } from '../../../interfaces/areas.interfaces';
import { RegisterService } from '../../../services/services_sg/register.service';
import { ListService } from '../../../services/services_sg/list.service';

import { FormsModule } from '@angular/forms';
import { DeleteService } from '../../../services/services_sg/delete.service';
import { PRIMENG_MODULES } from './areas.imports';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [PRIMENG_MODULES, FormsModule],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class AreasComponent {
  listArea: Area[] = [];
  searchTerm: string = '';
  selectedArea: Area | null = null;
  loading: boolean = true;
  loadingSave: boolean = false;
  dialogVisible: boolean = false;

  private srvReg = inject(RegisterService);
  private srvList = inject(ListService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);
  private srvDelete = inject(DeleteService);

  ngOnInit(): void {
    this.listAreas();
  }

  private async listAreas() {
    this.loading = true;
    try {
      const res = await this.srvList.getListAreas().toPromise();
      this.listArea = res.data;
    } catch (error) {
      this.handleError(error, 'Error al cargar áreas:');
    } finally {
      this.loading = false;
    }
  }

  filterAreas(query: string): Area[] {
    const lowerQuery = query.toLowerCase();
    return this.listArea.filter((area) =>
      area.nombre_area.toLowerCase().includes(lowerQuery)
    );
  }

  openAddAreaDialog() {
    this.selectedArea = this.createNewArea();
    this.dialogVisible = true;
  }

  openEditAreaDialog(area: Area) {
    this.selectedArea = { ...area };
    this.dialogVisible = true;
  }

  private createNewArea(): Area {
    return {
      id: 0,
      nombre_area: '',
      estado: 0,
    };
  }

  set estadoBoolean(value: boolean) {
    if (this.selectedArea) {
      this.selectedArea.estado = value ? 1 : 0;
    }
  }

  get estadoBoolean(): boolean {
    return this.selectedArea ? this.selectedArea.estado === 1 : false;
  }

  private async addArea() {
    if (!this.validateArea()) return;
    try {
      const res = await this.srvReg
        .postRegisterAreas(this.selectedArea!)
        .toPromise();
      this.handleResponse(res, 'Agregado');
    } catch (error) {
      this.handleError(error, 'Error al agregar área');
    }
  }

  private async editArea() {
    if (!this.validateArea()) return;
    try {
      const res = await this.srvReg
        .postEditAreas(this.selectedArea!)
        .toPromise();
      this.handleResponse(res, 'Editado');
    } catch (error) {
      this.handleError(error, 'Error al editar área');
    }
  }

  deleteArea(area: Area) {
    this.srvConfirm.confirm({
      message: '¿Está seguro de eliminar el área?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      accept: async () => {
        try {
          const res = await this.srvDelete
            .requestdeleteAreas(area.id)
            .toPromise();
          this.handleResponse(res, 'Eliminado');
          await this.listAreas();
        } catch (error) {
          this.handleError(error, 'Error al eliminar área');
        }
      },
    });
  }

  async saveArea() {
   
    
   if (!this.selectedArea) return;

    this.loadingSave = true;
    try {
      this.selectedArea.id === 0
        ? await this.addArea()
        : await this.editArea();
      this.dialogVisible = false;
      await this.listAreas();
    } catch (error) {
      this.handleError(error, 'Error al guardar el área');
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

  private validateArea(): boolean {
    if (this.selectedArea!.nombre_area.trim() === '') {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre del área es obligatorio',
      });
      return false;
    }

    return true;
  }

  private handleError(error: any, message: string): void {
  
    this.srvMensajes.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al procesar la solicitud',
    });
    this.loading = false;
    this.loadingSave = false;
  }

}
