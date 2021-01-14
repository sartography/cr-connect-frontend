import {AppEnvironment} from 'sartography-workflow-lib';

declare var ENV;

export const _has = (env, key, temp): boolean => env && ![null, undefined, temp, ''].includes(env[key]);

export const environment: AppEnvironment = {
  homeRoute: _has(ENV, 'homeRoute', '$HOME_ROUTE') ? ENV.homeRoute : 'research',
  production: _has(ENV, 'production', '$PRODUCTION') ? (ENV.production === 'true') : false,
  hideDataPane: _has(ENV, 'hideDataPane', '$HIDE_DATA_PANE') ? (ENV.hideDataPane === 'true') : true,
  api: _has(ENV, 'api', '$API_URL') ? ENV.api : 'http://localhost:5000/v1.0',
  irbUrl: _has(ENV, 'irbUrl', '$IRB_URL') ? ENV.irbUrl : 'http://localhost:5001',
  title: _has(ENV, 'title', '$TITLE') ? ENV.title : 'Research Ramp-Up Toolkit',
  googleAnalyticsKey: _has(ENV, 'googleAnalyticsKey', '$GOOGLE_ANALYTICS_KEY') ? ENV.googleAnalyticsKey : 'UA-168203235-5',
  sentryKey: _has(ENV, 'sentryKey', '$SENTRY_KEY') ? ENV.sentryKey : undefined,
};
