import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {InboxComponent} from './inbox/inbox.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {ProfileComponent} from './profile/profile.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignOutComponent} from './sign-out/sign-out.component';
import {WorkflowComponent} from './workflow/workflow.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'workflow',
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
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'sign-out',
    component: SignOutComponent
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
  exports: [RouterModule]
})
export class AppRoutingModule {
}
