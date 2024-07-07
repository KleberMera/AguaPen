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
        path: 'usuarios-trabajadores',
        loadComponent: () => import('./usuarios-trabajadores/usuarios-trabajadores.component'),
      },
      {
        path: 'usuarios-roles',
        loadComponent: () => import('./usuarios-roles/usuarios-roles.component'),
      },
      {
        path: 'registros',
        loadComponent: () => import('./registros/registros.component'),
    
      },
      {
        path: 'reportes',
        loadComponent: () => import('./reportes/reportes.component'),
      },
      {
        path: '**',
        redirectTo: '/home/dashboard',
      }
    ]
  },

];

export default routes;
