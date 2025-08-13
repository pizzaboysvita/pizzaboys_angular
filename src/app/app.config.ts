import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, provideRouter, withHashLocation, withPreloading } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
 import { ToastrModule, ToastrService } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptor/auth.interceptor';
import { provideNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,withHashLocation(),withPreloading(PreloadAllModules)),provideNgxMask(), ToastrService, importProvidersFrom(BrowserAnimationsModule, ToastrModule.forRoot({
          timeOut: 3000, // Example option
          positionClass: 'toast-top-right', // Example option
          preventDuplicates: true, // Example option
        })),
  provideAnimations(),provideHttpClient(withInterceptors([authInterceptor])),
  ]
};
