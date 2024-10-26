import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HandleErrorService } from '../../services/gen/handle-error.service';

export const handleErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const srvAuth = inject(AuthService);
  const router = inject(Router);
  const handleErrorService = inject(HandleErrorService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      handleErrorService.storeError(error);
      console.error(error);
      if (error.status === 401) {
        errorMessage = 'No tiene permisos para acceder a esta información';
        srvAuth.clearAuthData();
        router.navigate(['/auth']);
      }
      return throwError(() => errorMessage);
    })
  );
};
