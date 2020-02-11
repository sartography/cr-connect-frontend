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
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {ChartsModule} from 'ng2-charts';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import {NgxPageScrollCoreModule} from 'ngx-page-scroll-core';
import {ApiService} from './_services/api/api.service';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HelpDialogComponent} from './help-dialog/help-dialog.component';
import {HelpWrapperComponent} from './help-wrapper/help-wrapper.component';
import {helpWrapperExtension} from './help-wrapper/help-wrapper.extension';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {InboxComponent} from './inbox/inbox.component';
import {NavbarComponent} from './navbar/navbar.component';
import {PanelWrapperComponent} from './panel-wrapper/panel-wrapper.component';
import {PreferencesComponent} from './preferences/preferences.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignOutComponent} from './sign-out/sign-out.component';
import {StudiesComponent} from './studies/studies.component';
import {TaskSpecListComponent} from './task-spec-list/task-spec-list.component';
import {WorkflowProcessMenuItemComponent} from './workflow-process-menu-item/workflow-process-menu-item.component';
import {WorkflowProcessComponent} from './workflow-process/workflow-process.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';
import {WorkflowStepsMenuListComponent} from './workflow-steps-menu-list/workflow-steps-menu-list.component';
import {WorkflowComponent} from './workflow/workflow.component';
import { WorkflowFilesComponent } from './workflow-files/workflow-files.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HelpComponent,
    HelpDialogComponent,
    HelpWrapperComponent,
    HomeComponent,
    InboxComponent,
    NavbarComponent,
    PanelWrapperComponent,
    PreferencesComponent,
    SignInComponent,
    SignOutComponent,
    StudiesComponent,
    TaskSpecListComponent,
    WorkflowComponent,
    WorkflowProcessComponent,
    WorkflowProcessMenuItemComponent,
    WorkflowSpecListComponent,
    WorkflowStepsMenuListComponent,
    WorkflowFilesComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ChartsModule,
    FlexLayoutModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
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
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    NgxPageScrollCoreModule.forRoot({duration: 500, scrollOffset: 84}),
    NgxPageScrollModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    ApiService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    HelpDialogComponent
  ],
})
export class AppModule {
}
