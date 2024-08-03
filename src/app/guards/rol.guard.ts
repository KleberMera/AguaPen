import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const rolGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.viewDataUser().pipe(
    map((res: any) => {
      if (res && res.data.rol_id === 1) {
        return true;
      } else {
        router.navigate(['/home/dashboard']);
        return false;
      }
    }),
  );
};
