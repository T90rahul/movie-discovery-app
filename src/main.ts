import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { sanitizeError } from './app/shared/utils/error-utils';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    console.error(sanitizeError(err));
  });
