import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(App, appConfig, )
  .catch((err) => console.error(err));

// bootstrapApplication(App, {
//   providers: [
//     provideAnimations(),   // Required for toast animations
//     provideToastr({        // Registers toast config and service
//       positionClass: 'toast-bottom-right',
//       timeOut: 3000,
//       closeButton: true
//     })        
//   ]
// });