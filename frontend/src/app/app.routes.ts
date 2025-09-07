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
    { path: 'warehouse', canActivate: [privateGuard], loadComponent: () => import('./pages/warehouse/warehouse') },
    { path: 'products', canActivate: [privateGuard], loadComponent: () => import('./pages/products/products') },
    { path: 'inventory', canActivate: [privateGuard], loadComponent: () => import('./pages/inventory/inventory') },
    { path: 'cash-management', canActivate: [privateGuard], loadComponent: () => import('./pages/cash-management/cash-management') },
    { path: 'sales-made', canActivate: [privateGuard], loadComponent: () => import('./pages/sales-made/sales-made') },
    { path: 'technical-support', canActivate: [publicGuard], loadComponent: () => import('./pages/technical-support/technical-support') },
    { path: 'courses', canActivate: [privateGuard], loadComponent: () => import('./pages/courses/courses') },
    { path: 'participants', canActivate: [privateGuard], loadComponent: () => import('./pages/participants/participants') },
    { path: 'instructors', canActivate: [privateGuard], loadComponent: () => import('./pages/instructors/instructors') },
    { path: 'registrations', canActivate: [privateGuard], loadComponent: () => import('./pages/registrations/registrations') },
    { path: 'infants', canActivate: [privateGuard], loadComponent: () => import('./pages/infants/infants') },
    { path: 'my-profile', canActivate: [privateGuard], loadComponent: () => import('./pages/profile/profile') },
    { path: '**', redirectTo: 'home' }
];
