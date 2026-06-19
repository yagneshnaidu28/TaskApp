// core/guards/auth.guard.ts
// Runs BEFORE Angular loads a route
// If no token → redirect to /login
// If token exists → allow navigation to the route

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    // inject() is the standalone way to get services (no constructor needed)
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;  // ✅ has token → let them through
    }

    // ❌ no token → send to login page
    router.navigate(['/login']);
    return false;
};