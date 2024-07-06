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
  filteredUsers: any[] = [];
  searchQuery: string = '';
  suggestions: any[] = [];
  selectedUser: any = null;
  dropdownOptions: any[] = [];

  private srvRegDet = inject(RegisterDetailsService);
  private srvList = inject(ListService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);

  ngOnInit(): void {
    this.getListUsuarios();
  }

  getListUsuarios() {
    this.srvList.getListUsuarios().subscribe((res: any) => {
      this.ListUsers = res.data;
      this.filteredUsers = this.ListUsers;
      this.dropdownOptions = this.ListUsers; // Populate dropdown options
      console.log(res.data);
    });
  }

  searchUser() {
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = this.ListUsers; // Si la búsqueda está vacía, mostrar todos los usuarios
      this.srvMensajes.add({ severity: 'info', summary: 'Búsqueda vacía', detail: 'Mostrando todos los usuarios' });
      return;
    }

    this.filteredUsers = this.ListUsers.filter(user =>
      (user.tx_nombre && user.tx_nombre.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
      (user.tx_cedula && user.tx_cedula.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );

    if (this.filteredUsers.length > 0) {
      this.srvMensajes.add({ severity: 'success', summary: 'Usuario encontrado', detail: `Se encontraron ${this.filteredUsers.length} usuario(s)` });
    } else {
      this.srvMensajes.add({ severity: 'error', summary: 'Usuario no encontrado', detail: 'No se encontraron usuarios con ese criterio de búsqueda' });
    }
  }

  getSuggestions(event: any) {
    this.suggestions = this.ListUsers.filter(user =>
      (user.tx_nombre && user.tx_nombre.toLowerCase().includes(event.query.toLowerCase())) ||
      (user.tx_cedula && user.tx_cedula.toLowerCase().includes(event.query.toLowerCase()))
    );
  }

  selectUser(event: any) {
    this.filteredUsers = [event]; // Muestra solo el usuario seleccionado
    this.srvMensajes.add({ severity: 'info', summary: 'Usuario seleccionado', detail: `Has seleccionado a ${event.tx_nombre}` });
  }
}
