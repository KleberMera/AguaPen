import { Routes } from "@angular/router";

export const routes : Routes = [
    {
        path: '',
        loadComponent: () => import('./login/login.component')
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component')
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component')
    }
]

export default routes;