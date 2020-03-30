import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterTestingModule} from '@angular/router/testing';
import {
  ApiService,
  MockEnvironment,
  mockStudies,
  mockWorkflow0,
  mockWorkflows, mockWorkflowSpecCategories,
  mockWorkflowSpecs, mockWorkflowStats,
  mockWorkflowStats0
} from 'sartography-workflow-lib';
import {DashboardComponent} from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatTabsModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.study = mockStudies[0];
    component.workflows = mockWorkflows;
    component.workflowSpecs = mockWorkflowSpecs;
    component.workflowSpecCategories = mockWorkflowSpecCategories;
    fixture.detectChanges();

    mockWorkflows.forEach((wf, i) => {
      const statsReq = httpMock.expectOne(`apiRoot/workflow/${wf.id}/stats`);
      expect(statsReq.request.method).toEqual('GET');
      statsReq.flush(mockWorkflowStats[i]);
    });

    expect(component.categoryTabs).toBeTruthy();
    expect(component.categoryTabs.length).toEqual(mockWorkflows.length);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
