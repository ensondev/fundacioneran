import { Routes } from "@angular/router";

export default [
    { path: 'log-in', loadComponent: () => import('../auth/log-in/log-in') },
    { path: '**', redirectTo: 'log-in' }
] as Routes;