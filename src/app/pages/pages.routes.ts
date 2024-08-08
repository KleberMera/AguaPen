import { Routes } from '@angular/router';
import { rolGuard } from '../guards/rol.guard';
import { roldataGuard } from '../guards/roldata.guard';

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
        canActivate: [roldataGuard],
      },
      {
        path: 'vehiculos',
        loadComponent: () => import('./vehiculos/vehiculos.component'),
        canActivate: [roldataGuard],
      },
      {
        path: 'trabajadores',
        loadComponent: () => import('./trabajadores/trabajadores.component'),
        canActivate: [roldataGuard],
      },
      {
        path: 'areas',
        loadComponent: () => import('./areas/areas.component'),
        canActivate: [roldataGuard],
      },
      {
        path: 'roles',
        loadComponent: () => import('./roles/roles.component'),
        canActivate: [rolGuard],
      },
      {
        path: 'registros',
        loadComponent: () => import('./registros/registros.component'),
        canActivate: [roldataGuard],
    
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
        path: 'editar-eliminar',
        loadComponent: () => import ('./edit-delete/edit-delete.component')
      },
      {
        path: '**',
        redirectTo: '/home/dashboard',
      },
      
    ]
  },

];

export default routes;
