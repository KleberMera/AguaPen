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
        path: 'vehiculos',
        loadComponent: () => import('./vehiculos/vehiculos.component'),
      },
      {
        path: 'trabajadores',
        loadComponent: () => import('./trabajadores/trabajadores.component'),
      },
      {
        path: 'areas',
        loadComponent: () => import('./areas/areas.component'),
      },
      {
        path: 'roles',
        loadComponent: () => import('./roles/roles.component'),
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
        path: 'reportes-usuarios',
        loadComponent: () => import('./reportes-usuarios/reportes-usuarios.component'),
      },
      {
        path: 'reportes-areas',
        loadComponent: () => import('./reportes-areas/reportes-areas.component'),
        
      },
      {
        path: 'reportes-vehiculos',
        loadComponent: () => import('./reportes-vehiculos/reportes-vehiculos.component'),
      },
      {
        path: 'registros-areas',
        loadComponent: () => import('./registros-areas/registros-areas.component'),
        
      },
      {
        path: 'registros-vehiculos',
        loadComponent: () => import('./registros-vehiculos/registros-vehiculos.component'),
      },
      {
        path: '**',
        redirectTo: '/home/dashboard',
      },
      
    ]
  },

];

export default routes;
