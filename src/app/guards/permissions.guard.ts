import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PermisosService } from '../services/permisos.service';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export const permissionsGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const permisosService = inject(PermisosService);
  const router = inject(Router);

 const userId = authService.getStoredUser().id;

 if (userId) {
   return permisosService.getListPermisosPorUsuario(userId).pipe(
     map((res: any) => {
       const permisos = res.data;
       const requiredRoute = state.url;
       const hasPermission = permisos.some((permiso: any) => permiso.opcion_routerLink === requiredRoute);

       if (hasPermission) {
         return true;
       } else {
         router.navigate(['/home/dashboard']);
         return false;
       }
     }),
     
   );
 } else {
   router.navigate(['/home/dashboard']);
   return of(false);
 }
};
