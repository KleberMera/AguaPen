import { Routes } from "@angular/router";
import { authinverseGuard } from "../guards/authinverse.guard";

export const routes : Routes = [
    {
        path: '',
        loadComponent: () => import('./login/login.component'),
        canActivate: [authinverseGuard], 
    },
    
]

export default routes;