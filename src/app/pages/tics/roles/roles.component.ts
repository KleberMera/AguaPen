import { Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from './roles.imports';

import { ConfirmationService, MessageService } from 'primeng/api';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PermisosService } from '../../../services/auth/permisos.service';

import { forkJoin, map } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { ListService } from '../../../services/seguridad-industrial/list.service';
import {
  MutatePayloadCreate,
  User,
  UserAttributes,
} from '../../../models/users.model';
import { Permisos } from '../../../models/permisos.model';

@Component({
  selector: 'app-usuarios-roles',
  standalone: true,
  imports: [PRIMENG_MODULES, FormsModule, CommonModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class UsuariosRolesComponent implements OnInit {
  users: UserAttributes[] = [];
  opciones_modulos: any[] = [];
  opciones_usuarios: any[] = [];
  selectionUser: any = null;
  filteredOptions: any[] = [];
  selectedModulo: string = '';
  loadingMessage: string = '';
  loading: boolean = false;
  loadingpermissions: boolean = false;
  permisos: Permisos[] = [];
  visibleAsignacion: boolean = false;
  visibleActualizacion: boolean = false;

  newUser: UserAttributes = {
    id: 0,
    cedula: '',
    telefono: '',
    nombres: '',
    apellidos: '',
    email: '',
    usuario: '',
    password: '',
    estado: 1,
  };

  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private SrvPermissions = inject(PermisosService);
  private srvList = inject(ListService);

  ngOnInit() {
    this.loadingMessage = 'Cargando datos...';
    this.loadUsers();
    this.loadModulos();
    this.getListUsuarios();
  }
  ListUsers: User[] = [];
  dropdownOptions: User[] = [];
  selectedUser: User | null = null;

  async getListUsuarios(): Promise<void> {
    try {
      const res = await this.srvList.getListUsuarios().toPromise();
      this.dropdownOptions = res.data.filter(
        (user: User) => user.dt_status === 1
      );
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar usuarios',
      });
    }
  }

  selectUser(event: any): void {
    const user = event.value;
    if (user) {
      this.selectedUser = user;
      this.messageService.add({
        severity: 'info',
        summary: 'Usuario seleccionado',
        detail: `Has seleccionado a ${this.capitalize(user.tx_nombre)}`,
      });

      const [apellidos, nombres] = this.splitName(user.tx_nombre);

      Object.assign(this.newUser, {
        apellidos,
        nombres,
        cedula: user.tx_cedula,
        email: user.tx_correo,
        usuario: user.dt_usuario,
        password: user.tx_cedula,
      });
    }
  }

  splitName(fullName: string): [string, string] {
    const nombresArray = fullName.split(' ').map(this.capitalize);
    const apellidos = nombresArray.slice(0, 2).join(' ');
    const nombres = nombresArray.slice(2).join(' ');
    return [apellidos, nombres];
  }

  capitalize(text: string): string {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  formatUserLabel(user: User): string {
    return `${this.capitalize(user.tx_nombre)} (${user.tx_cedula})`;
  }

  registerUser() {
    if (this.validateForm()) {
      this.loading = true;

      const payload: MutatePayloadCreate = {
        mutate: [
          {
            operation: 'create',
            attributes: {
              ...this.newUser,
            },
          },
        ],
      };

      this.authService.createUser(payload).subscribe(
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

  validateForm(): boolean {
    return (
      this.validateNombres() &&
      this.validateApellidos() &&
      this.validateCedula() &&
      //  this.validateTelefono() &&
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

  loadUsers() {
    this.authService.listUsers().subscribe((response) => {
      this.users = response.data; // Adjust based on your API response structure
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

  UpdateUser(userId: number) {
    this.users.forEach((user: any) => {
      if (user.id === userId) {
        let userSelected = user;

        //Cambiar el estado del usuario
        if (userSelected.estado === 0) {
          userSelected.estado = 1;
        } else {
          userSelected.estado = 0;
        }
        this.authService.updateUser(userSelected).subscribe(
          (response) => {
            console.log(response);

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Usuario actualizado exitosamente',
            });
            this.loadUsers(); // Refresca la lista de usuarios
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar el usuario',
            });
          }
        );
      }
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
    // Resetea los datos del formulario
    this.newUser = {
      id: 0,
      cedula: '',
      telefono: '',
      nombres: '',
      apellidos: '',
      email: '',
      usuario: '',
      password: '',
      estado: 1,
    };

    // limpirar selecciones de usuarios y permisos
    this.selectedUser = null;
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  loadModulos() {
    this.SrvPermissions.getListModulos().subscribe((res) => {
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

  usuariosModulos(user_id: number) {
    return this.SrvPermissions.getListPermisosPorUsuario(user_id).pipe(
      map((res) => res.data.map((permiso: any) => permiso.opcion_id))
    );
  }

  filterOptionsByModulo() {
    if (this.selectedModulo) {
      this.usuariosModulos(this.selectionUser).subscribe((opcionesUsuario) => {
        this.SrvPermissions.getListModulos().subscribe((res) => {
          this.filteredOptions = res.data.filter(
            (item: any) =>
              item.nombre_modulo === this.selectedModulo &&
              !opcionesUsuario.includes(item.opcion_id)
          );
        });
      });
    } else {
      this.filteredOptions = [];
    }
  }

  seleccionarTodo: boolean = false;

  seleccionarTodasOpciones(event: any) {
    this.filteredOptions.forEach((opcion) => {
      opcion.seleccionado = event.checked;
      opcion.per_editar = event.checked;
      opcion.per_ver = event.checked;
    });
  }

  modulosDisponibles: any[] = [];
  selectionModulo: string = '';
  permisosUsuario: any[] = [];

  loadUserPermissions() {
    if (this.selectionUser) {
      this.SrvPermissions.getListPermisosPorUsuario(
        this.selectionUser
      ).subscribe((res) => {
        const permisos = res.data;

        // Extraer los módulos únicos
        this.modulosDisponibles = [
          ...new Set(permisos.map((permiso: any) => permiso.nombre_modulo)),
        ];

        // Guardar permisos para filtrarlos por módulo
        this.permisosUsuario = permisos;
      });
    }
  }

  loadPermissionsByModule() {
    if (this.selectionModulo) {
      this.filteredOptions = this.permisosUsuario
        .filter(
          (permiso: any) => permiso.nombre_modulo === this.selectionModulo
        )
        .map((permiso: any) => ({
          permiso_id: permiso.permiso_id,
          opcion_id: permiso.opcion_id,
          opcion_label: permiso.opcion_label,
          per_editar: permiso.per_editar,
          per_ver: permiso.per_ver,
        }));
    }
  }

  actualizarPermisos() {
    this.loadingpermissions = true;

    // Crear un array de observables para las solicitudes de actualización
    const requests = this.filteredOptions.map((opcion) => {
      const updatedPermiso = {
        id: opcion.permiso_id,
        user_id: this.selectionUser,
        opcion_id: opcion.opcion_id,
        per_editar: opcion.per_editar,
        per_ver: opcion.per_ver,
      };

      return this.SrvPermissions.postEditPermisos(updatedPermiso);
    });

    // Usar forkJoin para esperar a que todas las solicitudes de actualización se completen
    forkJoin(requests).subscribe(
      (responses) => {
        this.loadingpermissions = false;
        this.limpiarDatos();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Permisos actualizados correctamente',
        });
      },
      (error) => {
        this.loadingpermissions = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar los permisos',
        });
      }
    );
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
        per_ver: true,
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

    // Crear un array de observables para las solicitudes
    const requests = permisosSeleccionados.map((permiso) =>
      this.SrvPermissions.postCreatePermisos(permiso)
    );

    // Usar forkJoin para ejecutar todas las solicitudes en paralelo y esperar a que todas se completen
    forkJoin(requests).subscribe(
      (responses) => {
        this.loadingpermissions = false;
        this.limpiarDatos();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Permisos guardados correctamente',
        });
      },
      (error) => {
        this.loadingpermissions = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un problema al guardar los permisos',
        });
      }
    );
  }

  eliminarPermisos(opcion: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este permiso?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarPermisosSeleccionados(opcion);
      },
    });
  }

  eliminarPermisosSeleccionados(opcion: any) {
    this.loadingpermissions = true;
    const permisosSeleccionados = opcion.permiso_id;
    this.SrvPermissions.requestdeletePermisos(permisosSeleccionados).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Permisos eliminados correctamente',
        });
        this.loadingpermissions = false;
        this.loadPermissionsByModule();
        this.limpiarDatos();
      }
    );
  }

  //Una vez guardado los permisos o actualizados, limpiar todo
  limpiarDatos() {
    this.selectedModulo = '';
    this.seleccionarTodo = false;
    this.filteredOptions = [];
    this.permisosUsuario = [];
    this.selectionUser = null;
    this.visibleAsignacion = false;
    this.visibleActualizacion = false;
  }
}
