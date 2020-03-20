import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {RouterTestingModule} from '@angular/router/testing';
import {
  ApiService,
  MockEnvironment,
  mockStudies,
  mockWorkflow0,
  mockWorkflows,
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
    fixture.detectChanges();

    mockWorkflows.forEach((wf, i) => {
      const sReq = httpMock.expectOne(`apiRoot/workflow/${wf.id}/stats`);
      expect(sReq.request.method).toEqual('GET');
      sReq.flush(mockWorkflowStats[i]);
    });

    expect(component.cards).toBeTruthy();
    expect(component.cards.length).toEqual(mockWorkflows.length);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
