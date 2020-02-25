import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ChartsModule} from 'ng2-charts';
import {of} from 'rxjs';
import {ApiService, MockEnvironment, mockStudy0, mockWorkflows, mockWorkflowSpecs} from 'sartography-workflow-lib';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {StudyComponent} from './study.component';

describe('StudyComponent', () => {
  let component: StudyComponent;
  let fixture: ComponentFixture<StudyComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        StudyComponent,
      ],
      imports: [
        ChartsModule,
        HttpClientTestingModule,
        MatIconModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: convertToParamMap({study_id: '0'})}},
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(StudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/study/0');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockStudy0);
    expect(component.study).toBeTruthy();
    expect(component.study.id).toEqual(mockStudy0.id);

    const wfsReq = httpMock.expectOne('apiRoot/workflow-specification');
    expect(wfsReq.request.method).toEqual('GET');
    wfsReq.flush(mockWorkflowSpecs);
    expect(component.workflowSpecs).toBeTruthy();
    expect(component.workflowSpecs).toEqual(mockWorkflowSpecs);

    const wsReq = httpMock.expectOne('apiRoot/study/0/workflows');
    expect(wsReq.request.method).toEqual('GET');
    wsReq.flush(mockWorkflows);
    expect(component.workflows).toBeTruthy();
    expect(component.workflows).toEqual(mockWorkflows);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start a workflow', () => {
    const loadWorkflowsSpy = spyOn(component, 'loadWorkflows').and.stub();
    const addWorkflowForStudySpy = spyOn((component as any).api, 'addWorkflowForStudy').and.returnValue(of(null));
    component.startWorkflow();
    expect(addWorkflowForStudySpy).toHaveBeenCalled();
    expect(loadWorkflowsSpy).toHaveBeenCalled();
  });
});
