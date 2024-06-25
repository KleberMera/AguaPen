import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/pages.routes'),
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
  }
  

  
];
