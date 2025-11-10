import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { AuthService } from './app/services/auth.service';
import { APP_INITIALIZER } from '@angular/core';

export function checkTokenOnStart(authService: AuthService) {
  return () => authService.checkTokenExpiration();
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: checkTokenOnStart,
      deps: [AuthService],
      multi: true
    }
    ],
}).catch((err) => console.error(err));
