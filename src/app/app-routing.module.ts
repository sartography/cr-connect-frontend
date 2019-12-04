import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {InboxComponent} from './inbox/inbox.component';
import {LogoutComponent} from './logout/logout.component';
import {PreferencesComponent} from './preferences/preferences.component';


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
