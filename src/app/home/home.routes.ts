import { Routes } from "@angular/router";

export const routes : Routes = [
   {
      path: '',
      loadComponent: () => import('./dashboard/dashboard.component')
   },
   { 
      path: 'productos',
      loadComponent: () => import('./productos/productos.component')
   }
]

export default routes;