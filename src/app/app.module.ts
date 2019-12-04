import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import {NgxPageScrollCoreModule} from 'ngx-page-scroll-core';
import {ApiService} from './_services/api/api.service';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';
import {PanelWrapperComponent} from './panel-wrapper/panel-wrapper.component';
import {TaskSpecListComponent} from './task-spec-list/task-spec-list.component';
import {WorkflowProcessMenuItemComponent} from './workflow-process-menu-item/workflow-process-menu-item.component';
import {WorkflowProcessComponent} from './workflow-process/workflow-process.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';
import {WorkflowStepsMenuListComponent} from './workflow-steps-menu-list/workflow-steps-menu-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    PanelWrapperComponent,
    TaskSpecListComponent,
    WorkflowProcessComponent,
    WorkflowProcessMenuItemComponent,
    WorkflowSpecListComponent,
    WorkflowStepsMenuListComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      wrappers: [
        {name: 'panel', component: PanelWrapperComponent},
      ],
    }),
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    NgxPageScrollModule,
    NgxPageScrollCoreModule.forRoot({duration: 500, scrollOffset: 84}),
    ReactiveFormsModule,
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
