// core/interceptors/auth.interceptor.ts
// This runs BEFORE every HTTP request leaves the browser
// It reads the JWT token from localStorage and attaches it to the request header
// FastAPI's get_current_user dependency reads this header to identify the user

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Read token from localStorage
    const token = localStorage.getItem('task_manager_token');

    if (token) {
        // Clone the request and add the Authorization header
        // We CLONE because HttpRequest objects are immutable
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
                // FastAPI reads this header in: oauth2_scheme = OAuth2PasswordBearer(...)
            }
        });
        return next(authReq);  // send the modified request
    }

    // No token → send request as-is (public routes like login/register)
    return next(req);
};