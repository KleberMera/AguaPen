import { permissionsGuard } from './../guards/permissions.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./seguridad-industrial/dashboard/dashboard.component'),
      },
      {
        path: `productos`,
        loadComponent: () => import('./seguridad-industrial/productos/productos.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'vehiculos',
        loadComponent: () => import('./seguridad-industrial/vehiculos/vehiculos.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'trabajadores',
        loadComponent: () => import('./seguridad-industrial/trabajadores/trabajadores.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'areas',
        loadComponent: () => import('./seguridad-industrial/areas/areas.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'roles',
        loadComponent: () => import('./seguridad-industrial/roles/roles.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'registros',
        loadComponent: () => import('./seguridad-industrial/registros/registros.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'reportes',
        loadComponent: () => import('./seguridad-industrial/reportes/reportes.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'reportes-usuarios',
        loadComponent: () => import('./seguridad-industrial/reportes-usuarios/reportes-usuarios.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'reportes-areas',
        loadComponent: () => import('./seguridad-industrial/reportes-areas/reportes-areas.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'reportes-vehiculos',
        loadComponent: () => import('./seguridad-industrial/reportes-vehiculos/reportes-vehiculos.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'registros-areas',
        loadComponent: () => import('./seguridad-industrial/registros-areas/registros-areas.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'registros-vehiculos',
        loadComponent: () => import('./seguridad-industrial/registros-vehiculos/registros-vehiculos.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: 'anulados',
        loadComponent: () => import('./seguridad-industrial/anulados/anulados.component'),
        canActivate: [permissionsGuard],
      },

      {
        path: 'editar-eliminar',
        loadComponent: () => import('./seguridad-industrial/edit-delete/edit-delete.component'),
        canActivate: [permissionsGuard],
      },
      {
        path: `editpages`,
        loadComponent: () => import('./tics/editpages/editpages.component'),
        canActivate: [permissionsGuard],
      },
      
      {
        path: '**',
        redirectTo: '/home/dashboard',
      },
    ],
  },
];

export default routes;
