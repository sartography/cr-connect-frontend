import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
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
import {PipesModule} from './_pipes/pipes.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {FooterComponent} from './footer/footer.component';
import {HelpDialogComponent} from './help-dialog/help-dialog.component';
import {HelpWrapperComponent} from './help-wrapper/help-wrapper.component';
import {helpWrapperExtension} from './help-wrapper/help-wrapper.extension';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {InboxComponent} from './inbox/inbox.component';
import {NavbarComponent} from './navbar/navbar.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {PanelWrapperComponent} from './panel-wrapper/panel-wrapper.component';
import {ProfileComponent} from './profile/profile.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignOutComponent} from './sign-out/sign-out.component';
import {StudiesComponent} from './studies/studies.component';
import {StudyCardComponent} from './study-card/study-card.component';
import {StudyComponent} from './study/study.component';
import {WorkflowFormComponent} from './workflow-form/workflow-form.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';
import {WorkflowStepsMenuListComponent} from './workflow-steps-menu-list/workflow-steps-menu-list.component';
import {WorkflowComponent} from './workflow/workflow.component';
import { FileValueAccessorDirective } from './file-upload/file-value-accessor.directive';
import { FileFieldComponent } from './file-field/file-field.component';


export class ThisEnvironment implements AppEnvironment {
  production = environment.production;
  api = environment.api;
  googleAnalyticsKey = environment.googleAnalyticsKey;
  irbUrl = environment.irbUrl;
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
    StudyCardComponent,
    FileValueAccessorDirective,
    FileFieldComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ChartsModule,
    FlexLayoutModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      types: [
        { name: 'file', component: FileFieldComponent, wrappers: ['panel'] },
        { name: 'files', component: FileUploadComponent, wrappers: ['panel'] }
      ],
      wrappers: [
        {name: 'panel', component: PanelWrapperComponent},
        {name: 'help', component: HelpWrapperComponent},
      ],
      extensions: [
        {name: 'help', extension: {onPopulate: helpWrapperExtension}},
      ],
    }),
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
