import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: 'auth', canActivate: [publicGuard], loadChildren: () => import('./auth/auth.routes') },
    { path: 'users', canActivate: [publicGuard], loadComponent: () => import('../app/pages/users/users') },
    { path: 'home', canActivate: [privateGuard], loadComponent: () => import('./pages/home/home') },
    { path: 'donors', canActivate: [privateGuard], loadComponent: () => import('./pages/donors/donors') },
    { path: 'donations', canActivate: [privateGuard], loadComponent: () => import('./pages/donations/donations') },
    { path: 'beneficiaries', canActivate: [privateGuard], loadComponent: () => import('./pages/beneficiaries/beneficiaries') },
    { path: 'deliveries', canActivate: [privateGuard], loadComponent: () => import('./pages/deliveries/deliveries') },
    { path: 'warehouse', canActivate: [privateGuard], loadComponent: () => import('./pages/warehouse/warehouse')},
    { path: '**', redirectTo: 'home' }
];
