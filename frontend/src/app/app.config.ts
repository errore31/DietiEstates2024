import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Necessario per HttpClient
import { provideAnimations } from '@angular/platform-browser/animations'; // Necessario per Toastr
import { provideToastr } from 'ngx-toastr'; // Necessario per Toastr

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // Abilita il servizio HttpClient usato in Auth
    provideToastr({
      timeOut: 3000, //durata (3 secondi)
      positionClass: 'toast-top-right', //appare in alto a destra
      preventDuplicates: true,
      progressBar: true, // Mostra una barra che si accorcia col tempo
      closeButton: true, // Mostra una X per chiudere
    }), 
  ]
};