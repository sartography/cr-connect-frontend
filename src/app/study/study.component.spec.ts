import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ChartsModule} from 'ng2-charts';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockStudy0, mockUsers, StudyAssociate,
  StudyStatus,
  StudyStatusLabels
} from 'sartography-workflow-lib';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {LoadingComponent} from '../loading/loading.component';
import {StudyComponent} from './study.component';


export const studyAssociateOne: StudyAssociate = {
  uid: 'bb8',
  access: true,
  role: 'Cute Robot',
  ldap_info: {
    uid: 'bb8',
    given_name: 'BB8',
    email_address: 'bb8@starwars.corp',
    display_name: 'BeeBee Eight',
  }
};

export const studyAssociateTwo: StudyAssociate = {
  uid: 'c3p0',
  access: true,
  role: 'Comic Relief Robot',
  ldap_info: {
    uid: 'c3p0',
    given_name: 'Human Cyborg Relations',
    email_address: 'c3p0@starwars.corp',
    display_name: 'Cyborg',
  }
};



describe('StudyComponent', () => {
  let component: StudyComponent;
  let fixture: ComponentFixture<StudyComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        LoadingComponent,
        StudyComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        ChartsModule,
        HttpClientTestingModule,
        MatDividerModule,
        MatIconModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0'}))},
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(StudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/study/0?update_status=true');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockStudy0);

    const associatesMock = httpMock.expectOne('apiRoot/study/0/associates');
    expect(associatesMock.request.method).toEqual('GET');
    associatesMock.flush([studyAssociateOne, studyAssociateTwo]);

    expect(component.study).toBeTruthy();
    expect(component.study.id).toEqual(mockStudy0.id);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get status label', () => {
    expect(component.getStatusLabel(StudyStatus.IN_PROGRESS))
      .toEqual(StudyStatusLabels.IN_PROGRESS);
  });

  it('should check for workflows', () => {
    expect(component.allWorkflows.length).toBeGreaterThan(0);
  });

  it('should have Associates', () => {
    expect(component.associates.length).toBeGreaterThan(0);
  });

  it('should select workflow', () => {
    const workflowId = component.study.categories[0].workflows[0].id;
    component.selectWorkflow(workflowId);
    expect(component.isWorkflowSelected).toBeTrue()
    expect(component.selectedWorkflowId).toEqual(workflowId);

    component.selectWorkflow(undefined);
    expect(component.isWorkflowSelected).toBeFalse()
    expect(component.selectedWorkflowId).toBeUndefined();
  });

});
