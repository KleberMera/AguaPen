import { Routes } from "@angular/router";

export const routes : Routes = [
   {
      path: '',
      loadComponent: () => import('./dashboard/dashboard.component')
   }
]

export default routes;