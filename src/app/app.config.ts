import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    BrowserModule,
    BrowserAnimationsModule, provideAnimationsAsync()
  ]
};
