import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import * as Sentry from "@sentry/angular";
import { BrowserTracing } from "@sentry/tracing";
import { AppModule } from "./app/app.module";
import {environment} from './environments/environment.runtime';

if (environment.production) {
  enableProdMode();
}
Sentry.init({
  dsn: environment.sentryKey,
  environment: environment.sentryEnvironment,
  integrations: [
    // Registers and configures the Tracing integration,
    // which automatically instruments your application to monitor its
    // performance, including custom Angular routing instrumentation
    new BrowserTracing({
      tracingOrigins: ["localhost", "https://testing.crconnect.uvadcos.io", "https://staging.crconnect.uvadcos.io"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
