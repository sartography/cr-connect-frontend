import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {ChartsModule} from 'ng2-charts';
import {ToFormlyPipe} from './_pipes/to-formly.pipe';
import {routes} from './app-routing.module';
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
import {WorkflowStepsMenuListComponent} from './workflow-steps-menu-list/workflow-steps-menu-list.component';
import {WorkflowComponent} from './workflow/workflow.component';


describe('Router: App', () => {
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DashboardComponent,
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
        StudyCardComponent,
        StudyComponent,
        ToFormlyPipe,
        WorkflowComponent,
        WorkflowFilesComponent,
        WorkflowFormComponent,
        WorkflowStepsMenuListComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        ChartsModule,
        FormsModule,
        FormlyMaterialModule,
        FormlyModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        HttpClient,
      ]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  });

  it('fakeAsync works', fakeAsync(() => {
    const promise = new Promise(resolve => {
      setTimeout(resolve, 10);
    });
    let done = false;
    promise.then(() => (done = true));
    tick(50);
    expect(done).toBeTruthy();
  }));

  it('navigate to "" redirects you to /', fakeAsync(() => {
    router.navigate(['']).then(() => {
      expect(location.path()).toBe('/');
    });
  }));
});
