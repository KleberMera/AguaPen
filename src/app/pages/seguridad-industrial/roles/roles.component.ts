import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from './roles.imports';
import { usersAdmin } from '../../../interfaces/users.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { PermisosService } from '../../../services/permisos.service';
import { Permisos } from '../../../interfaces/permisos.interfaces';

@Component({
  selector: 'app-usuarios-roles',
  standalone: true,
  imports: [PRIMENG_MODULES, FormsModule, CommonModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class UsuariosRolesComponent implements OnInit {
  users: usersAdmin[] = [];
  opciones_modulos: any[] = [];
  opciones_usuarios: any[] = [];
  selectionUser: any = null;
  filteredOptions: any[] = [];
  selectedModulo: string = '';
  loadingMessage: string = '';
  loading: boolean = false;
  loadingpermissions: boolean = false;
  permisos: Permisos[] = [];
  newUser: usersAdmin = {
    id: 0,
    cedula: '',
    telefono: '',
    nombres: '',
    apellidos: '',
    email: '',
    usuario: '',
    password: '',
  };

  newPermiso: Permisos = {
    id: 0,
    user_id: 0,
    opcion_id: 0,
    per_editar: false,
    per_ver: false,
  };

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private SrvPermissions: PermisosService
  ) {}

  ngOnInit() {
    this.loadingMessage = 'Cargando datos...';
    this.loadUsers();
    this.loadModulos();
  }

  registerUser() {
    if (this.validateForm()) {
      this.loading = true;
      this.authService.createUser(this.newUser).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Usuario registrado exitosamente',
          });
          this.loading = false;
          this.loadUsers(); // Reload the user list
          this.resetForm(); // Reset form after registration
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al registrar el usuario',
          });
          this.loading = false;
        }
      );
    }
  }

  loadUsers() {
    this.authService.listUsers().subscribe((response) => {
      this.users = response.data; // Adjust based on your API response structure
      console.log(this.users);

      const uniqueUsuarios = new Map();
      this.users.forEach((item: any) => {
        if (!uniqueUsuarios.has(item.nombres)) {
          uniqueUsuarios.set(item.nombres, {
            label: `${item.nombres} ${item.apellidos}`,
            value: item.id,
          });
        }
      });
      this.opciones_usuarios = Array.from(uniqueUsuarios.values());
    });
  }

  loadModulos() {
    this.SrvPermissions.getListModulos().subscribe((res) => {
      console.log(res.data);
      
      const uniqueModulos = new Map();
      res.data.forEach((item: any) => {
        if (!uniqueModulos.has(item.nombre_modulo)) {
          uniqueModulos.set(item.nombre_modulo, {
            label: item.nombre_modulo,
            value: item.nombre_modulo,
          });
        }
      });
      this.opciones_modulos = Array.from(uniqueModulos.values());
    });
  }
  

  validateForm(): boolean {
    return (
      this.validateNombres() &&
      this.validateApellidos() &&
      this.validateCedula() &&
      this.validateTelefono() &&
      this.validateEmail()
    );
  }

  validateNombres(): boolean {
    const namePattern = /^[a-zA-Z\s]+$/;
    return namePattern.test(this.newUser.nombres);
  }

  validateApellidos(): boolean {
    const namePattern = /^[a-zA-Z\s]+$/;
    return namePattern.test(this.newUser.apellidos);
  }

  validateCedula(): boolean {
    return (
      this.newUser.cedula.length === 10 && !isNaN(Number(this.newUser.cedula))
    );
  }

  validateTelefono(): boolean {
    return (
      this.newUser.telefono.length === 10 &&
      !isNaN(Number(this.newUser.telefono))
    );
  }

  validateEmail(): boolean {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailPattern.test(this.newUser.email);
  }
  confirmDeleteUser(userId: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este usuario?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(userId);
      },
    });
  }

  deleteUser(userId: number) {
    this.authService.deleteUser(userId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario eliminado correctamente',
        });
        this.loadUsers(); // Refresca la lista de usuarios
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Fallo al eliminar el usuario',
        });
      },
    });
  }

  private resetForm() {
    this.newUser = {
      id: 0,
      cedula: '',
      telefono: '',
      nombres: '',
      apellidos: '',
      email: '',
      usuario: '',
      password: '',
    };
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
 
 }






filterOptionsByModulo() {
  if (this.selectedModulo) {
    this.SrvPermissions.getListModulos().subscribe((res) => {
      this.filteredOptions = res.data.filter(
        (item: any) => item.nombre_modulo === this.selectedModulo
      );
    });
  } else {
    this.filteredOptions = [];
  }
}

guardarPermisos() {
  this.loadingpermissions = true;
  // Filtrar los permisos seleccionados
  const permisosSeleccionados = this.filteredOptions
    .filter((opcion) => opcion.seleccionado)
    .map((opcion) => ({
      user_id: this.selectionUser,
      opcion_id: opcion.opcion_id,
      per_editar: opcion.per_editar || false,
      per_ver: opcion.per_ver || false,
    }));

  // Validar si hay un usuario seleccionado
  if (!this.selectionUser) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Seleccione un usuario',
    });
    this.loadingpermissions = false;
    return;
  }

  // Validar si hay al menos una opción seleccionada
  if (permisosSeleccionados.length === 0) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Seleccione al menos una opción',
    });
    this.loadingpermissions = false;
    return;
  }

  // Llamar al servicio para guardar los permisos seleccionados
  permisosSeleccionados.forEach((permiso) => {
    this.SrvPermissions.postCreatePermisos(permiso).subscribe(
      (response) => {
        this.loadingpermissions = false;
        console.log(response);
         
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Permisos guardados correctamente',
        });
      },
      (error) => {
        this.loadingpermissions = false;
        console.error('Error al guardar permisos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un problema al guardar los permisos',
        });
        console.error('Error al guardar permisos:', error);
      }
    );
  });
}

seleccionarTodo: boolean = false;

seleccionarTodasOpciones(event: any) {
  this.filteredOptions.forEach(opcion => {
    opcion.seleccionado = event.checked;
    opcion.per_editar = event.checked;
    opcion.per_ver = event.checked;
  });
}




}
