import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment.development';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private srvAuth = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private environment = environment.aguapenApi;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.srvAuth.getToken();

    let authReq = req;

    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }

    return this.verifyToken(authToken).pipe(
      switchMap(() => next.handle(authReq)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.srvAuth.clearAuthData();
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }

  private verifyToken(token: string | null): Observable<any> {
    if (!token) {
      console.log('Token no proporcionado');
      return throwError(() => new Error('Token no proporcionado'));
    }

    return this.http.post(`${this.environment}verifyToken`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
