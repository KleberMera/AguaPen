import { Component, inject } from '@angular/core';
import { PRIMEMG_MODULES } from './edit-delete.imports';
import { ListService } from '../../services/list.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-delete',
  standalone: true,
  imports: [PRIMEMG_MODULES, FormsModule],
  templateUrl: './edit-delete.component.html',
  styleUrl: './edit-delete.component.scss'
})

export default class EditDeleteComponent {
  reportOptions = [
    { label: 'Trabajadores', value: 'trabajadores' },
    { label: 'Areas', value: 'areas' },
    { label: 'Vehiculos', value: 'vehiculos' }
  ];

  trabajadoresOptions: any[] = [];
  idRegistrosOptions: any[] = [];
  selectedReport: string | undefined;
  selectedTrabajador: string | undefined;
  selectedIdRegistro: string | undefined;

  private srvList = inject(ListService);

  onReportChange(event: any) {
    if (this.selectedReport === 'trabajadores') {
      this.srvList.getReportsTrabajadores().subscribe(
        res => {
          console.log('Trabajadores Report:', res.data);
          const uniqueTrabajadores = new Map();
          res.data.forEach((item: any) => {
            if (!uniqueTrabajadores.has(item.cedula)) {
              uniqueTrabajadores.set(item.cedula, {
                label: `${item.nombre} (${item.cedula})`,
                value: item.cedula
              });
            }
          });
          this.trabajadoresOptions = Array.from(uniqueTrabajadores.values());
        },
        error => console.error('Error fetching Trabajadores report:', error)
      );
    } else {
      // Reset trabajadoresOptions if another report type is selected
      this.trabajadoresOptions = [];
      this.selectedTrabajador = undefined;
      this.idRegistrosOptions = [];
      this.selectedIdRegistro = undefined;
    }
  }

  onTrabajadorChange(event: any) {
    const selectedTrabajadorCedula = event.value;
    this.srvList.getReportsTrabajadores().subscribe(
      res => {
        const registros = res.data.filter((item: any) => item.cedula === selectedTrabajadorCedula);
        const uniqueRegistros = new Set<number>();
        const uniqueIdRegistrosOptions: { label: string, value: number }[] = [];
  
        registros.forEach((item: any) => {
          if (!uniqueRegistros.has(item.id_tbl_registros)) {
            uniqueRegistros.add(item.id_tbl_registros);
            uniqueIdRegistrosOptions.push({
              label: `ID Registro: ${item.id_tbl_registros}`,
              value: item.id_tbl_registros
            });
          }
        });
  
        this.idRegistrosOptions = uniqueIdRegistrosOptions;
        console.log('ID Registros Options:', this.idRegistrosOptions);
      },
      error => console.error('Error fetching ID Registros:', error)
    );
  }
  
  
}
