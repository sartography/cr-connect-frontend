import { Injectable, ErrorHandler} from '@angular/core'
import * as Sentry from '@sentry/browser'

@Injectable()
export class SentryErrorHandler implements ErrorHandler {

  constructor() {
    Sentry.init({
      dsn: 'https://fe2395d6b72f4c29a36f2e8e222c7923@o401361.ingest.sentry.io/5263377'
    })
  }

  handleError(error) {
    Sentry.captureException(error.originalError || error)
  }
}