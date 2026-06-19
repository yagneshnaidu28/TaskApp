// pages/login/login.ts
// Handles both Login and Register on the same page (toggled by a flag)
// Uses Angular Signals for reactive state management

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginComponent {

    // Toggle between login and register form
    isRegisterMode = signal(false);

    // Form fields — two-way bound with [(ngModel)]
    email = '';
    password = '';

    // UI state signals
    isLoading = signal(false);
    errorMessage = signal('');
    successMessage = signal('');

    constructor(private authService: AuthService, private router: Router) { }

    toggleMode(): void {
        // Switch between Login ↔ Register
        this.isRegisterMode.update(v => !v);
        this.errorMessage.set('');
        this.successMessage.set('');
        this.email = '';
        this.password = '';
    }

    onSubmit(): void {
        // Basic validation
        if (!this.email || !this.password) {
            this.errorMessage.set('Please fill in all fields');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        if (this.isRegisterMode()) {
            // --- REGISTER FLOW ---
            this.authService.register({ email: this.email, password: this.password })
                .subscribe({
                    next: () => {
                        // After successful register, auto-switch to login
                        this.successMessage.set('Account created! Please log in.');
                        this.isRegisterMode.set(false);
                        this.isLoading.set(false);
                        this.password = '';
                    },
                    error: (err) => {
                        const detail = err.error?.detail;
                        const msg = typeof detail === 'string'
                            ? detail
                            : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Registration failed');
                        this.errorMessage.set(msg);
                        this.isLoading.set(false);
                    }
                });
        } else {
            // --- LOGIN FLOW ---
            this.authService.login({ email: this.email, password: this.password })
                .subscribe({
                    next: () => {
                        // Token is saved inside AuthService, now navigate to dashboard
                        this.router.navigate(['/dashboard']);
                    },
                    error: (err) => {
                        const detail = err.error?.detail;
                        const msg = typeof detail === 'string'
                            ? detail
                            : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Invalid email or password');
                        this.errorMessage.set(msg);
                        this.isLoading.set(false);
                    }
                });
        }
    }
}