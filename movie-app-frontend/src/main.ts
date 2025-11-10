import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { AuthService } from './app/services/auth.service';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([authInterceptor])),
    AuthService
    ],
}).catch((err) => console.error(err));
