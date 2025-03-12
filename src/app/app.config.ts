import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptorService } from './core/interceptors/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    provideToastr({
      timeOut: 2500,
      progressBar: true,
      toastClass: 'ngx-toastr toast-w300',
      progressAnimation: 'increasing',
    }),
    provideHttpClient(withInterceptors([httpInterceptorService])),
    importProvidersFrom([BrowserAnimationsModule]), provideAnimationsAsync(),
  ],
};
