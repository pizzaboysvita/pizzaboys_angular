import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withHashLocation, withPreloading } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptor/auth.interceptor';
import { provideNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,withHashLocation(),withPreloading(PreloadAllModules)),provideNgxMask(),
  provideAnimations(),provideHttpClient(withInterceptors([authInterceptor])),
  ]
};
