import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../../services/services_auth/auth.service';

export const permissionsGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
    // Recuperar los permisos desde localStorage
    const permisos = JSON.parse(localStorage.getItem('userPermissions') || '[]');
    const requiredRoute = state.url;
    const hasPermission = permisos.some((permiso: any) => permiso.opcion_routerLink === requiredRoute);
    if (hasPermission) {
      return true;
    } else {
      router.navigate(['/home/dashboard']);
      return false;
    }
 
};
