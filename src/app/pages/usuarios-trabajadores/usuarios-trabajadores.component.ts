import { Component, inject, OnInit } from '@angular/core';
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
const PRIMEMG_MODULES = [
  FieldsetModule,
  TableModule,

  ProgressSpinnerModule,

  InputTextModule,
  IconFieldModule,
  InputIconModule,
  DropdownModule,
  ButtonModule,
];

@Component({
  selector: 'app-usuarios-trabajadores',
  standalone: true,
  imports: [PRIMEMG_MODULES, FormsModule],
  templateUrl: './usuarios-trabajadores.component.html',
  styleUrl: './usuarios-trabajadores.component.scss',
})
export default class UsuariosTrabajadoresComponent implements OnInit {
  ListUsersWorkers: any[] = [];
  searchTerm: string = '';
  selectedArea: string = '';
  selectedCargo: string = '';
  loading: boolean = true;

  areaOptions: any[] = []; // Opciones para áreas
  cargoOptions: any[] = []; // Opciones para cargos
  filteredCargoOptions: any[] = []; // Opciones de cargos filtradas

  private srvList = inject(ListService);

  ngOnInit(): void {
    this.getListUsuarios();
  }

  getListUsuarios() {
    this.srvList.getListUsuarios().subscribe(
      (res: any) => {
        this.ListUsersWorkers = res.data;
        this.loading = false;
        console.log(res.data);

        // Inicializa las opciones de filtro
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
        (user.tx_nombre.toLowerCase().includes(lowerQuery) ||
          user.tx_cedula.toLowerCase().includes(lowerQuery)) &&
        (!area || user.tx_area === area) &&
        (!cargo || user.tx_cargo === cargo)
      );
    });
  }

  getUniqueOptions(data: any[], field: string) {
    return [...new Set(data.map((item) => item[field]))]
      .map((value) => ({ label: value, value: value }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Ordenar alfabéticamente
  }
  

  clearSearchTerm() {
    this.searchTerm = '';
  }

  clearSelectedArea() {
    this.selectedArea = '';
    this.filteredCargoOptions = this.cargoOptions; // Restablece las opciones de cargo
  }

  clearSelectedCargo() {
    this.selectedCargo = '';
  }

  onAreaChange() {
    if (this.selectedArea) {
      this.filteredCargoOptions = this.ListUsersWorkers.filter(
        (user) => user.tx_area === this.selectedArea
      ).map((user) => ({
        label: user.tx_cargo,
        value: user.tx_cargo,
      }));

      // Eliminar duplicados
      this.filteredCargoOptions = this.getUniqueOptions(this.filteredCargoOptions, 'label');
    } else {
      this.filteredCargoOptions = this.cargoOptions;
    }
    this.selectedCargo = ''; // Clear selected cargo when area changes
  }
}
