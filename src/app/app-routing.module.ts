import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {InboxComponent} from './inbox/inbox.component';
import {LogoutComponent} from './logout/logout.component';
import {PreferencesComponent} from './preferences/preferences.component';
import {StudiesComponent} from './studies/studies.component';
import {WorkflowComponent} from './workflow/workflow.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'studies',
    component: StudiesComponent
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
    path: 'preferences',
    component: PreferencesComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
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
