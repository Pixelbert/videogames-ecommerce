import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <-- Aquí corregimos el nombre de la importación

// Aquí también le decimos que arranque usando AppComponent
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));