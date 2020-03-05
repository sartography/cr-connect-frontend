import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import createClone from 'rfdc';
import {ApiService, MockEnvironment, mockStudy0, mockWorkflows, WorkflowTaskState} from 'sartography-workflow-lib';
import {StudyProgressComponent} from './study-progress.component';

describe('StudyProgressComponent', () => {
  let component: StudyProgressComponent;
  let fixture: ComponentFixture<StudyProgressComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudyProgressComponent],
      imports: [
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(StudyProgressComponent);
    component = fixture.componentInstance;
    component.study = mockStudy0;
    fixture.detectChanges();

    const wsReq = httpMock.expectOne(`apiRoot/study/${mockStudy0.id}/workflows`);
    expect(wsReq.request.method).toEqual('GET');
    wsReq.flush(mockWorkflows);
    expect(component.workflows).toEqual(mockWorkflows);
    expect(component.percentComplete).toEqual(0);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate percent complete', () => {
    const doneWorkflows = createClone()(mockWorkflows);
    component.workflows = doneWorkflows.map(wf => {
      wf.user_tasks.forEach(t => t.state = WorkflowTaskState.COMPLETED);
      return wf;
    });
    component.calculatePercentComplete();
    expect(component.percentComplete).toEqual(100);
  });
});
