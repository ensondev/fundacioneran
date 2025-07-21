import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    /*     provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }), */
    provideRouter(routes),
    provideHttpClient(
      withFetch(), //Usa Fetch API en lugar de XHR”.
      withInterceptors([authInterceptor]) // incluye el interceptor
    )
  ]
};
