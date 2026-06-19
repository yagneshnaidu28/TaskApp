// core/services/auth.service.ts
// Handles: Login, Register, Logout, storing the JWT token
// Injectable means Angular's DI system can give this to any component that needs it

import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthToken, LoginRequest, RegisterRequest, User } from '../../models/user.model';

@Injectable({
    providedIn: 'root'  // singleton — one instance shared across the whole app
})
export class AuthService {

    private readonly API_URL = 'http://localhost:8000';
    private readonly TOKEN_KEY = 'task_manager_token';

    // signal() is Angular 19's reactive state — like useState in React
    // Any component reading currentUser() will auto-update when it changes
    currentUser = signal<User | null>(null);
    isLoggedIn = signal<boolean>(false);

    constructor(private http: HttpClient, private router: Router) {
        // On app start, check if there's already a token saved (user was logged in before)
        this.checkExistingSession();
    }

    private checkExistingSession(): void {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (token) {
            // Token exists → user was previously logged in
            this.isLoggedIn.set(true);
        }
    }

    register(data: RegisterRequest): Observable<User> {
        // POST http://localhost:8000/auth/register
        return this.http.post<User>(`${this.API_URL}/auth/register`, data);
    }

    login(data: LoginRequest): Observable<AuthToken> {
        // OAuth2PasswordRequestForm expects x-www-form-urlencoded body with username + password
        const body = new HttpParams()
            .set('username', data.email)
            .set('password', data.password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post<AuthToken>(`${this.API_URL}/auth/login`, body.toString(), { headers }).pipe(
            tap((response) => {
                // After successful login: save token to localStorage and update signals
                localStorage.setItem(this.TOKEN_KEY, response.access_token);
                this.isLoggedIn.set(true);
            })
        );
    }

    logout(): void {
        // Clear everything and go back to login
        localStorage.removeItem(this.TOKEN_KEY);
        this.isLoggedIn.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }
}