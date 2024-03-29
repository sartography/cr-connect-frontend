import {ClipboardModule} from '@angular/cdk/clipboard';
import {APP_BASE_HREF, PlatformLocation} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, ErrorHandler, Injectable, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
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
import {NgxFileDropModule} from 'ngx-file-drop';
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import {MarkdownModule, MarkedOptions, MarkedRenderer} from 'ngx-markdown';
import {
  ApiService,
  AppEnvironment,
  AuthInterceptor,
  ErrorInterceptor,
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
import {LoadingComponent} from './loading/loading.component';
import {NavbarComponent} from './navbar/navbar.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {ProcessViewerComponent} from './process-viewer/process-viewer.component';
import {ProfileComponent} from './profile/profile.component';
import {StudiesDashboardComponent} from './studies-dashboard/studies-dashboard.component';
import {ApprovalDialogComponent} from './_dialogs/approval-dialog/approval-dialog.component';
import {StudiesComponent} from './studies/studies.component';
import {StudyEventsComponent} from './study-events/study-events.component';
import {StudyComponent} from './study/study.component';
import {WorkflowFilesComponent} from './workflow-files/workflow-files.component';
import {WorkflowFormComponent} from './workflow-form/workflow-form.component';
import {WorkflowDialogComponent} from './workflow-dialog/workflow-dialog.component';
import {WorkflowResetDialogComponent} from './workflow-reset-dialog/workflow-reset-dialog.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';
import {WorkflowStepsMenuListComponent} from './workflow-steps-menu-list/workflow-steps-menu-list.component';
import {WorkflowComponent} from './workflow/workflow.component';
import {MatStepperModule} from '@angular/material/stepper';
import * as hljs from 'highlight.js';
import {ConfirmStudyStatusDialogComponent} from './_dialogs/confirm-study-status-dialog/confirm-study-status-dialog.component';
import { NavItemIconComponent } from './nav-item-icon/nav-item-icon.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NavLinksComponent } from './nav-links/nav-links.component';
import {MatTreeModule} from '@angular/material/tree';
import { WorkflowProgressMenuComponent } from './workflow-progress-menu/workflow-progress-menu.component';
import { ReviewProgressComponent } from './review-progress/review-progress.component';
import {MatPaginatorModule} from '@angular/material/paginator';

import { SecurityContext } from '@angular/core';
import { StandaloneComponent } from './standalone/standalone.component';
import { StudyWarningsComponent } from './study-warnings/study-warnings.component';
import { AutocompleteComponent } from './_forms/autocomplete/autocomplete.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { TaskLogsComponent } from './task-logs/task-logs.component';
import * as Sentry from '@sentry/angular';
import {Router} from '@angular/router';
import { DocumentHistoryComponent } from './document-history/document-history.component';

(document.defaultView as any).hljs = hljs;



@Injectable()
export class ThisEnvironment implements AppEnvironment {
  homeRoute = environment.homeRoute;
  production = environment.production;
  hideDataPane = environment.hideDataPane;
  api = environment.api;
  irbUrl = environment.irbUrl;
  title = environment.title;
  googleAnalyticsKey = environment.googleAnalyticsKey;
  sentryKey = environment.sentryKey;
}

/**
 * This function is used internal to get a string instance of the `<base href="" />` value from `index.html`.
 * This is an exported function, instead of a private function or inline lambda, to prevent this error:
 *
 * `Error encountered resolving symbol values statically.`
 * `Function calls are not supported.`
 * `Consider replacing the function or lambda with a reference to an exported function.`
 *
 * @param platformLocation an Angular service used to interact with a browser's URL
 * @return a string instance of the `<base href="" />` value from `index.html`
 */
export function getBaseHref(platformLocation: PlatformLocation): string {
  return platformLocation.getBaseHrefFromDOM();
}

/**
 * This mess does a bit of hakery to our markdown so it can display footnotes in a popup
 * window.  It comes close to many of the proposals for a footnote addition to markdown,
 * using the syntax [^1] to create a link to footnote #1.  To set the content that is displayed
 * for that footnote, we are using a code block where the language parameter is also [^1] such as
 * ```[1] This is the footnote
 * ```
 * The "1" here can be any string.
 * The content within the code block can contain any markdown.
 *
 * This also contains some changes to links, so they open in a new window.
 */
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  const linkRenderer = renderer.link;
  const referenceMatch = /\[\^([^\]]+)\](?!\()/g;
  const contentMatch = /\[\^([^\]]+)\]/;
  const referencePrefix = 'marked-fnref';

  const referenceTemplate = ref => ` <a onclick="callAngularFunction(\`${referencePrefix}${ref}\`);">
      <i class="material-icons mdc-button__icon">info</i></a>`;
  const interpolateReferences = (text) => text.replace(referenceMatch, (_, ref) => referenceTemplate(ref));

  renderer.paragraph = (text) => new MarkedRenderer().paragraph.apply(null, [
        interpolateReferences(text)
      ]);
  renderer.text = (text) => new MarkedRenderer().text.apply(null, [
        interpolateReferences(text)
      ]);

  renderer.heading = (text, level, raw, slugger) => {
    text = interpolateReferences(text);
    return new MarkedRenderer().heading(text, level, raw, slugger);
  };

  renderer.code = (text, language, escaped) => {
    if (language.match(contentMatch)) {
      const referenceId = language.match(contentMatch)[1];
      return `<input id='${referencePrefix}${referenceId}' type="hidden" value="${text}"/>`
    }
    return new MarkedRenderer().code(text, language, escaped); // Use Default
  };

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
        ConfirmStudyStatusDialogComponent,
        DashboardComponent,
        FooterComponent,
        HelpComponent,
        HomeComponent,
        InboxComponent,
        NavbarComponent,
        NotificationsComponent,
        ProfileComponent,
        StudiesComponent,
        StudyComponent,
        StudyEventsComponent,
        WorkflowComponent,
        WorkflowFilesComponent,
        WorkflowFormComponent,
        WorkflowSpecListComponent,
        WorkflowStepsMenuListComponent,
        CodeViewerComponent,
        ProcessViewerComponent,
        StudiesDashboardComponent,
        ApprovalDialogComponent,
        WorkflowResetDialogComponent,
        WorkflowDialogComponent,
        LoadingComponent,
        NavItemIconComponent,
        NavLinksComponent,
        WorkflowProgressMenuComponent,
        ReviewProgressComponent,
        StandaloneComponent,
        StudyWarningsComponent,
        AutocompleteComponent,
        TaskLogsComponent,
        DocumentHistoryComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        ChartsModule,
        ClipboardModule,
        FlexLayoutModule,
        FormlyModule.forRoot({
            types: [
                { name: 'autocomplete_ldap', component: AutocompleteComponent }
            ],
        }),
        FormsModule,
        HighlightModule,
        HttpClientModule,
        MarkdownModule.forRoot({
            markedOptions: {
                provide: MarkedOptions,
                useFactory: markedOptionsFactory,
            },
            sanitize: SecurityContext.NONE
        }),
        MatBadgeModule,
        MatBottomSheetModule,
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
        MatPaginatorModule,
        MatSortModule,
        AppRoutingModule,
        MatStepperModule,
        MatCheckboxModule,
        MatButtonToggleModule,
        MatTreeModule,
        MatAutocompleteModule,
        // <-- This line MUST be last (https://angular.io/guide/router#module-import-order-matters)
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
        ApiService,
        { provide: 'APP_ENVIRONMENT', useClass: ThisEnvironment },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: APP_BASE_HREF, useFactory: getBaseHref, deps: [PlatformLocation] },
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                languages: { json: () => import('../../node_modules/highlight.js/lib/languages/json') }
            }
        },
        { provide: ErrorHandler, useValue: Sentry.createErrorHandler({ showDialog: false, }), },
        { provide: Sentry.TraceService, deps: [Router], },
        { provide: APP_INITIALIZER, useFactory: () => () => { }, deps: [Sentry.TraceService], multi: true, }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(trace: Sentry.TraceService) {}
}
