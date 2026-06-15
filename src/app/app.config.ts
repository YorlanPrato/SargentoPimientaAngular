import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideScReCaptchaSettings } from '@semantic-components/re-captcha';

const recaptchaSiteKey = (import.meta as any).env?.['RECAPTCHA_SITE_KEY'] || '6LcaeCAtAAAAAJITlUfGGbA1M5F-V0WI4tutTyN0';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideScReCaptchaSettings({ v2SiteKey: recaptchaSiteKey }),
  ]
};
