// app/app.routes.ts
// This is the central routing table — maps URLs to components
// Angular reads this and knows what component to show for each URL

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Default route → redirect to login
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    // Public route — no guard needed
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login').then(m => m.LoginComponent)
        // loadComponent = lazy loading → only downloads this file when user visits /login
    },

    // Protected routes — authGuard runs first
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [authGuard]   // ← guard checks token before loading
    },
    {
        path: 'task-form',
        loadComponent: () =>
            import('./pages/task-form/task-form').then(m => m.TaskFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'task-edit/:id',    // :id is a URL parameter → /task-edit/3
        loadComponent: () =>
            import('./pages/task-edit/task-edit').then(m => m.TaskEditComponent),
        canActivate: [authGuard]
    },

    // Catch-all → any unknown URL goes to login
    {
        path: '**',
        redirectTo: 'login'
    }
];