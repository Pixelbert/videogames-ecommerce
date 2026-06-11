import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http'; // <-- 1. Importamos esta herramienta

export const appConfig: ApplicationConfig = {
  // 2. La agregamos a la lista de proveedores
  providers: [provideRouter(routes), provideHttpClient()] 
};