import {ClipboardModule} from '@angular/cdk/clipboard';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Injectable, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyModule} from '@ngx-formly/core';
import {NgProgressModule} from '@ngx-progressbar/core';
import {ChartsModule} from 'ng2-charts';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {NgxFileDropModule} from 'ngx-file-drop';
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import {MarkdownModule, MarkedOptions, MarkedRenderer} from 'ngx-markdown';
import {
  ApiService,
  AppEnvironment,
  AuthInterceptor,
  SartographyFormsModule,
  SartographyPipesModule,
  SartographyWorkflowLibModule
} from 'sartography-workflow-lib';
import {environment} from '../environments/environment.runtime';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CodeViewerComponent} from './code-viewer/code-viewer.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FooterComponent} from './footer/footer.component';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {InboxComponent} from './inbox/inbox.component';
import {NavbarComponent} from './navbar/navbar.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {ProcessViewerComponent} from './process-viewer/process-viewer.component';
import {ProfileComponent} from './profile/profile.component';
import {ResearchRequestsComponent} from './research-requests/research-requests.component';
import {ResearchComponent} from './research/research.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignOutComponent} from './sign-out/sign-out.component';
import {StudiesDashboardComponent} from './studies-dashboard/studies-dashboard.component';
import {StudiesProcessComponent} from './studies-process/studies-process.component';
import {StudiesComponent} from './studies/studies.component';
import {StudyProgressComponent} from './study-progress/study-progress.component';
import {StudyComponent} from './study/study.component';
import {WorkflowFilesComponent} from './workflow-files/workflow-files.component';
import {WorkflowFormComponent} from './workflow-form/workflow-form.component';
import {WorkflowResetDialogComponent} from './workflow-reset-dialog/workflow-reset-dialog.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';
import {WorkflowStepsMenuListComponent} from './workflow-steps-menu-list/workflow-steps-menu-list.component';
import {WorkflowComponent} from './workflow/workflow.component';
import { LoadingComponent } from './loading/loading.component';


@Injectable()
export class ThisEnvironment implements AppEnvironment {
  homeRoute = environment.homeRoute;
  production = environment.production;
  api = environment.api;
  irbUrl = environment.irbUrl;
}

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  const linkRenderer = renderer.link;

  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text);
    return html.replace(/^<a /, '<a role="link" tabindex="0" target="_blank" rel="nofollow" noopener noreferrer" ');
  };

  return {
    renderer,
    gfm: true,
    breaks: true,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    HelpComponent,
    HomeComponent,
    InboxComponent,
    NavbarComponent,
    NotificationsComponent,
    ProfileComponent,
    SignInComponent,
    SignOutComponent,
    StudiesComponent,
    StudyComponent,
    StudyProgressComponent,
    WorkflowComponent,
    WorkflowFilesComponent,
    WorkflowFormComponent,
    WorkflowSpecListComponent,
    WorkflowStepsMenuListComponent,
    CodeViewerComponent,
    ProcessViewerComponent,
    StudiesDashboardComponent,
    StudiesProcessComponent,
    WorkflowResetDialogComponent,
    ResearchComponent,
    ResearchRequestsComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ChartsModule,
    ClipboardModule,
    DeviceDetectorModule.forRoot(),
    FlexLayoutModule,
    FormlyModule,
    FormsModule,
    HighlightModule,
    HttpClientModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    NgProgressModule,
    NgxFileDropModule,
    ReactiveFormsModule,
    SartographyFormsModule,
    SartographyPipesModule,
    SartographyWorkflowLibModule,
    AppRoutingModule, // <-- This line MUST be last (https://angular.io/guide/router#module-import-order-matters)
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    ApiService,
    {provide: 'APP_ENVIRONMENT', useClass: ThisEnvironment},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: {json: () => import('../../node_modules/highlight.js/lib/languages/json')}
      }
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    WorkflowResetDialogComponent
  ]
})
export class AppModule {
}
