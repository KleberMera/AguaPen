import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.component'),

    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component'),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component'),
      },
      {
        path: '**',
        redirectTo: '/auth/login',
      }
    ]
  },
];

export default routes;
