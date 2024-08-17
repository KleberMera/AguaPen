import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from './roles.imports';
import { usersAdmin } from '../../../interfaces/users.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

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
  loadingMessage: string = '';
  loading: boolean = false;
  newUser: usersAdmin = {
    id: 0,
    cedula: '',
    telefono: '',
    nombres: '',
    apellidos: '',
    email: '',
    usuario: '',
    password: '',
    rol_id: 0, // Default role_id
  };

  roles = [
    { label: 'Administrador', value: 1 },
    { label: 'Cliente', value: 2 },
    { label: 'Visualizador', value: 3 },
  ];


  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadingMessage = 'Cargando datos...';
    this.loadUsers();
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
    
    });
  }
  
  validateForm(): boolean {
    return this.validateNombres() &&
           this.validateApellidos() &&
           this.validateCedula() &&
           this.validateTelefono() &&
           this.validateEmail();
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
    return this.newUser.cedula.length === 10 && !isNaN(Number(this.newUser.cedula));
  }

  validateTelefono(): boolean {
    return this.newUser.telefono.length === 10 && !isNaN(Number(this.newUser.telefono));
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
      rol_id: 0, // Default role_id
    };
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
}
