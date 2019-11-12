import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Observable, ObservableInput, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ApiService} from './_services/api/api.service';
import {ConfigService} from './_services/config/config.service';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {HomeComponent} from './home/home.component';

// Attempt to load the configuration from a file called config.json right next to
// this index page, it if exists.  Otherwise assume we are connecting to port
// 5000 on the local server.
export function load(http: HttpClient, config: ConfigService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      let url = './api/config';
      if (environment.hasOwnProperty('override_config_url')) {
        url = environment.override_config_url;
      }

      console.log('APP_INITIALIZER load config url:', url)

      http.get(url)
        .pipe(
          map((fromServer) => {
            config.fromProperties(fromServer);
            resolve(true);
          }),
          catchError((x: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
            console.log('Failed to load configuration, unable to find ./api/config');
            resolve(false);
            return of({});
          })
        ).subscribe();
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: load, deps: [HttpClient, ConfigService], multi: true},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
