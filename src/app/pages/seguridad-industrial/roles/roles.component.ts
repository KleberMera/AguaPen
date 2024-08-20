import { Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from './roles.imports';
import { usersAdmin } from '../../../interfaces/users.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PermisosService } from '../../../services/services_auth/permisos.service';
import { Permisos } from '../../../interfaces/permisos.interfaces';
import { map } from 'rxjs';
import { AuthService } from '../../../services/services_auth/auth.service';

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
  visibleAsignacion: boolean = false;
  visibleActualizacion: boolean = false;
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

  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private SrvPermissions = inject(PermisosService);

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

    this.filteredOptions.forEach((opcion) => {
      const updatedPermiso = {
        id: opcion.permiso_id,
        user_id: this.selectionUser,
        opcion_id: opcion.opcion_id,
        per_editar: opcion.per_editar,
        per_ver: opcion.per_ver,
      };

      this.SrvPermissions.postEditPermisos(updatedPermiso).subscribe(
        (response) => {


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
    });
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

    // Llamar al servicio para guardar los permisos seleccionados
    permisosSeleccionados.forEach((permiso) => {
      this.SrvPermissions.postCreatePermisos(permiso).subscribe(
        (response) => {
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
    });
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
