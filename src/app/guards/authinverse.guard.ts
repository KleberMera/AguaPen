import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const authinverseGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    // Redirigir a una página protegida si el usuario ya está autenticado
    router.navigate(['/home/dashboard']);
    return false;
  }

  return true;
};
