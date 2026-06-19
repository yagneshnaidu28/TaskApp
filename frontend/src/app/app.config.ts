// app/app.config.ts
// This replaces NgModule in modern Angular (v17+)
// Everything the app needs globally is registered here

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone-based change detection (default, keeps it simple)
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Register all our routes
    provideRouter(routes),

    // Enable HttpClient AND register our auth interceptor globally
    // withInterceptors([authInterceptor]) → attaches JWT to every request
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ]
};