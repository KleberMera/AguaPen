import { Component, inject, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Area, columnsAreas, fieldsFormsAreas } from '../../../models/areas.model';
import { RegisterService } from '../../../services/services_sg/register.service';
import { ListService } from '../../../services/services_sg/list.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { DeleteService } from '../../../services/services_sg/delete.service';
import { PRIMENG_MODULES } from './areas.imports';
import { AuthService } from '../../../services/services_auth/auth.service';
import { PermisosService } from '../../../services/services_auth/permisos.service';
import { AreaForm, createAreaPayload, updateAreaPayload } from '../../../core/payloads/areas.payload';
import { SearchComponent } from '../../../components/data/search/search.component';
import { TableComponent } from '../../../components/data/table/table.component';
import { FormsComponent } from '../../../components/data/forms/forms.component';
const COMPONENTS_DATA = [SearchComponent, TableComponent, FormsComponent];

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [PRIMENG_MODULES, COMPONENTS_DATA, FormsModule],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class AreasComponent {
  //Signals
  readonly areaForm = signal<FormGroup>(AreaForm());
  readonly columnsAreas = columnsAreas;
  readonly fields = fieldsFormsAreas;

  //State
  protected listArea = signal<Area[]>([]);
  protected searchTerm = signal<string>('');
  protected loading = signal<boolean>(true);
  protected loadingSave = signal<boolean>(false);
  protected dialogVisible = signal<boolean>(false);
  protected per_editar = signal<number>(0);

  //Services Injected
  private readonly srvReg = inject(RegisterService);
  private readonly srvList = inject(ListService);
  private readonly srvMensajes = inject(MessageService);
  private readonly srvConfirm = inject(ConfirmationService);
  private readonly srvDelete = inject(DeleteService);
  private readonly srvAuth = inject(AuthService);
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
      await this.listAreas();
    } catch (error: unknown) {
      this.handleError(error, 'Error al obtener permisos');
    }
  }

  private async listAreas() {
    this.loading.set(true);
    try {
      const res = await this.srvList.getListAreas().toPromise();
      this.listArea.set(res.data)
    } catch (error) {
      this.handleError(error, 'Error al cargar vehículos:');
    } finally {
      this.loading.set(false);
    }
  }

  filterAreas(query: string): Area[] {
    const lowerQuery = query.toLowerCase();
    return this.listArea().filter((area) =>
      area.nombre_area.toLowerCase().includes(lowerQuery)
    );
  }

  openAddAreaDialog() {
    this.areaForm().reset();    
    this.areaForm().patchValue({
      estado : 1,
    });
    this.dialogVisible.set(true);
  }

  openEditAreaDialog(area: Area) {
    this.dialogVisible.set(true);
    this.areaForm().patchValue({
      ...area
    });
  }

  async addArea() {
    try {
      const payload = createAreaPayload(this.areaForm());
      const res = await this.srvReg.postRegisterAreas(payload).toPromise();
      this.handleResponse(res, 'Agregado');
    } catch (error) {
      this.handleError(error, 'Error al agregar vehículo');
    }
  }

  private async editArea() {
    try {
      const payload = updateAreaPayload(this.areaForm());
      const res = await this.srvReg.postEditAreas(payload).toPromise();
      this.handleResponse(res, 'Editado');
    }
    catch (error) {
      this.handleError(error, 'Error al editar área'); 
    }
  }

  deleteArea(area: Area) {
    this.srvConfirm.confirm({ message: '¿Está seguro de eliminar el área?', header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      accept: async () => {
        try {
          const res = await this.srvDelete.requestdeleteAreas(area.id).toPromise();
          this.handleResponse(res, 'Eliminado');
          await this.listAreas();
        } catch (error) {
          this.handleError(error, 'Error al eliminar área');
        }
      },
    });
  }

  async saveArea() {
    const form = this.areaForm();
    if (!form.valid) return;
    const nombre_area = form.get('nombre_area')?.value?.trim().toLowerCase();
    const currentId = form.get('id')?.value;
    // Busca si existe un área con el mismo nombre pero diferente ID
    const existingArea = this.listArea().find( area =>  area.nombre_area.toLowerCase() === nombre_area && 
        area.id !== currentId
    );
    if (existingArea) {
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un área con este nombre' });
      return;
    }

    this.loadingSave.set(true);
     try {
      currentId  === null ? await this.addArea() : await this.editArea();
       this.dialogVisible.set(false);
       await this.listAreas();
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
    this.srvMensajes.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al procesar la solicitud',
    });
    this.loading.set(false);
    this.loadingSave.set(false);
  }

}
