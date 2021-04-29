import {Injectable, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppEnvironment, SessionRedirectComponent} from 'sartography-workflow-lib';
import {environment} from '../environments/environment.runtime';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {InboxComponent} from './inbox/inbox.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {ProfileComponent} from './profile/profile.component';
import {StudyComponent} from './study/study.component';
import {WorkflowComponent} from './workflow/workflow.component';

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

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: environment.homeRoute,
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'study/:study_id',
    component: StudyComponent
  },
  {
    path: 'study/:study_id/workflow/:workflow_id',
    component: WorkflowComponent
  },
  {
    path: 'study/:study_id/workflow/:workflow_id/task/:task_id',
    component: WorkflowComponent
  },
  {
    path: 'workflow/:workflow_id',
    component: WorkflowComponent
  },
  {
    path: 'workflow/:workflow_id/task/:task_id',
    component: WorkflowComponent
  },
  {
    path: 'help',
    component: HelpComponent
  },
  {
    path: 'inbox',
    component: InboxComponent
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'session',
    component: SessionRedirectComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 84],
    })
  ],
  exports: [RouterModule],
  providers: [
    {provide: 'APP_ENVIRONMENT', useClass: ThisEnvironment},
  ]
})
export class AppRoutingModule {
}
