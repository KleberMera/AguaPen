import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionsGuard } from './core/guards/permissions.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/pages.routes'),
    canActivate: [authGuard],
    
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full',
  },
];
