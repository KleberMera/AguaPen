import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    children: [
      {
        path: 'productos',
        loadComponent: () => import('./productos/productos.component'),
      }
    ]
  },

];

export default routes;
