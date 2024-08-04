import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const rolGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Obtener el usuario actual desde el AuthService
  const currentUser = authService.getStoredUser();

  // Verificar si el usuario tiene rol_id 1
  if (currentUser && currentUser.rol_id === 1) {
    return true;
  } else {
    // Redirigir a una página de acceso denegado o página principal si no tiene el rol adecuado
    router.navigate(['/home/dashboard']);
    return false;
  }
};
