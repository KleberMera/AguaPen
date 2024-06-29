import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component'),
      },
      {
        path: 'productos',
        loadComponent: () => import('./productos/productos.component'),
      },
      {
        path: '**',
        redirectTo: '/home/dashboard',
      }
    ]
  },

];

export default routes;
