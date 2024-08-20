import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/services_auth/auth.service';

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
