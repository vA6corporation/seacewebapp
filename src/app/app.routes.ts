import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: '', loadChildren: () => import('./auth/auth.routes').then(m => m.routes) },
    { path: 'seaces', loadChildren: () => import('./seaces/seaces.routes').then(m => m.routes) },
    { path: 'businesses', loadChildren: () => import('./businesses/businesses.routes').then(m => m.routes) },
    { path: 'partnerships', loadChildren: () => import('./partnerships/partnerships.routes').then(m => m.routes) },
    { path: 'shareholders', loadChildren: () => import('./shareholders/shareholders.routes').then(m => m.routes) },
    { path: 'beneficiaries', loadChildren: () => import('./beneficiaries/beneficiaries.routes').then(m => m.routes) },
    { path: 'financiers', loadChildren: () => import('./financiers/financiers.routes').then(m => m.routes) },
    { path: 'templates', loadChildren: () => import('./templates/templates.routes').then(m => m.routes) },
    { path: 'notifications', loadChildren: () => import('./notifications/notifications.routes').then(m => m.routes) },
    { path: 'followups', loadChildren: () => import('./followups/followups.routes').then(m => m.routes) },
    { path: 'users', loadChildren: () => import('./users/users.routes').then(m => m.routes) },
    { path: 'subscription', loadChildren: () => import('./subscription/subscription.routes').then(m => m.routes) },
    { path: 'settings', loadChildren: () => import('./settings/settings.routes').then(m => m.routes) }
];
