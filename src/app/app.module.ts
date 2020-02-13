import {HttpClientModule} from '@angular/common/http';
import {Injectable, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {NgProgressModule} from '@ngx-progressbar/core';
import {ChartsModule} from 'ng2-charts';
import {NgxFileDropModule} from 'ngx-file-drop';
import {MarkdownModule} from 'ngx-markdown';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import {NgxPageScrollCoreModule} from 'ngx-page-scroll-core';
import {ApiService, AppEnvironment} from 'sartography-workflow-lib';
import {environment} from '../environments/environment';
import {FileBaseComponent} from './_forms/file-base/file-base.component';
import {FileFieldComponent} from './_forms/file-field/file-field.component';
import {FileUploadComponent} from './_forms/file-upload/file-upload.component';
import {FileValueAccessorDirective} from './_forms/file-upload/file-value-accessor.directive';
import {HelpDialogComponent} from './_forms/help-dialog/help-dialog.component';
import {HelpWrapperComponent} from './_forms/help-wrapper/help-wrapper.component';
import {helpWrapperExtension} from './_forms/help-wrapper/help-wrapper.extension';
import {PanelWrapperComponent} from './_forms/panel-wrapper/panel-wrapper.component';
import {
  EmailValidator,
  EmailValidatorMessage,
  MaxValidationMessage,
  MinValidationMessage,
  MulticheckboxValidator,
  MulticheckboxValidatorMessage,
  PhoneValidator,
  PhoneValidatorMessage, ShowError,
  UrlValidator,
  UrlValidatorMessage
} from './_forms/validators/formly.validator';
import {PipesModule} from './_pipes/pipes.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FooterComponent} from './footer/footer.component';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {InboxComponent} from './inbox/inbox.component';
import {NavbarComponent} from './navbar/navbar.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {ProfileComponent} from './profile/profile.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignOutComponent} from './sign-out/sign-out.component';
import {StudiesComponent} from './studies/studies.component';
import {StudyCardComponent} from './study-card/study-card.component';
import {StudyComponent} from './study/study.component';
import {WorkflowFilesComponent} from './workflow-files/workflow-files.component';
import {WorkflowFormComponent} from './workflow-form/workflow-form.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';
import {WorkflowStepsMenuListComponent} from './workflow-steps-menu-list/workflow-steps-menu-list.component';
import {WorkflowComponent} from './workflow/workflow.component';


export class ThisEnvironment implements AppEnvironment {
  production = environment.production;
  api = environment.api;
  googleAnalyticsKey = environment.googleAnalyticsKey;
  irbUrl = environment.irbUrl;
}

@Injectable()
export class FormlyConfig {
  public static config = {
    extras: {
      showError: ShowError,
    },
    types: [
      {name: 'file', component: FileFieldComponent, wrappers: ['form-field']},
      {name: 'files', component: FileUploadComponent, wrappers: ['form-field']}
    ],
    validators: [
      {name: 'phone', validation: PhoneValidator},
      {name: 'email', validation: EmailValidator},
      {name: 'url', validation: UrlValidator},
      {name: 'multicheckbox', validation: MulticheckboxValidator},
    ],
    validationMessages: [
      {name: 'phone', message: PhoneValidatorMessage},
      {name: 'email', message: EmailValidatorMessage},
      {name: 'url', message: UrlValidatorMessage},
      {name: 'multicheckbox', message: MulticheckboxValidatorMessage},
      {name: 'required', message: 'This field is required.'},
      {name: 'min', message: MinValidationMessage},
      {name: 'max', message: MaxValidationMessage},
    ],
    wrappers: [
      {name: 'panel', component: PanelWrapperComponent},
      {name: 'help', component: HelpWrapperComponent},
    ],
    extensions: [
      {name: 'help', extension: {onPopulate: helpWrapperExtension}},
    ],
  };
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FileUploadComponent,
    FooterComponent,
    HelpComponent,
    HelpDialogComponent,
    HelpWrapperComponent,
    HomeComponent,
    InboxComponent,
    NavbarComponent,
    NotificationsComponent,
    PanelWrapperComponent,
    ProfileComponent,
    SignInComponent,
    SignOutComponent,
    StudiesComponent,
    StudyComponent,
    WorkflowComponent,
    WorkflowFormComponent,
    WorkflowSpecListComponent,
    WorkflowStepsMenuListComponent,
    WorkflowFilesComponent,
    StudyCardComponent,
    FileValueAccessorDirective,
    FileFieldComponent,
    FileBaseComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ChartsModule,
    FlexLayoutModule,
    FormlyMaterialModule,
    FormlyModule.forRoot(FormlyConfig.config),
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    NgxFileDropModule,
    NgxPageScrollCoreModule.forRoot({duration: 500, scrollOffset: 84}),
    NgxPageScrollModule,
    PipesModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgProgressModule,
    MatTableModule,
    // <-- This line MUST be last (https://angular.io/guide/router#module-import-order-matters)
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    ApiService,
    {provide: 'APP_ENVIRONMENT', useClass: ThisEnvironment}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    HelpDialogComponent
  ],
})
export class AppModule {
}
