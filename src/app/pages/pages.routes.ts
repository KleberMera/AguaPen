import { Routes } from '@angular/router';
import { rolGuard } from '../guards/rol.guard';
import { roldataGuard } from '../guards/roldata.guard';

const ruta_seguridad = 'industrial';
const ruta_modulo = 'modulos';

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
        path:`${ruta_seguridad}/productos`,
        loadComponent: () => import('./seguridad-industrial/productos/productos.component'),
        canActivate: [roldataGuard],
      },
      {
        path: 'vehiculos',
        loadComponent: () => import('./seguridad-industrial/vehiculos/vehiculos.component'),
        canActivate: [roldataGuard],
      },
      {
        path: 'trabajadores',
        loadComponent: () => import('./seguridad-industrial/trabajadores/trabajadores.component'),
        canActivate: [roldataGuard],
      },
      {
        path: 'areas',
        loadComponent: () => import('./seguridad-industrial/areas/areas.component'),
        canActivate: [roldataGuard],
      },
      {
        path: 'roles',
        loadComponent: () => import('./seguridad-industrial/roles/roles.component'),
        canActivate: [rolGuard],
      },
      {
        path: 'registros',
        loadComponent: () => import('./seguridad-industrial/registros/registros.component'),
        canActivate: [roldataGuard],
    
      },
      {
        path: 'reportes',
        loadComponent: () => import('./seguridad-industrial/reportes/reportes.component'),
        
      },
      {
        path: 'reportes-usuarios',
        loadComponent: () => import('./seguridad-industrial/reportes-usuarios/reportes-usuarios.component'),
      },
      {
        path: 'reportes-areas',
        loadComponent: () => import('./seguridad-industrial/reportes-areas/reportes-areas.component'),
        
      },
      {
        path: 'reportes-vehiculos',
        loadComponent: () => import('./seguridad-industrial/reportes-vehiculos/reportes-vehiculos.component'),
      },
      {
        path: 'registros-areas',
        loadComponent: () => import('./seguridad-industrial/registros-areas/registros-areas.component'),
        
      },
      {
        path: 'registros-vehiculos',
        loadComponent: () => import('./seguridad-industrial/registros-vehiculos/registros-vehiculos.component'),
      },
      {path: 'anulados',
       loadComponent: () => import('./seguridad-industrial/anulados/anulados.component')},
      {
        path: 'editar-eliminar',
        loadComponent: () => import ('./seguridad-industrial/edit-delete/edit-delete.component')
      },
      {
        path: `${ruta_modulo}/prueba`,
        loadComponent: () => import('./modulo/prueba/prueba.component'),
      },
      {
        path: 'prueba2',
        loadComponent: () => import('./modulo/prueba2/prueba2.component'),
      },
      {
        path: '**',
        redirectTo: '/home/dashboard',
      },
      
    ]
  },

];

export default routes;
