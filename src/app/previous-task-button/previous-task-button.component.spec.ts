import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {
  ApiService,
  MockEnvironment,
  mockWorkflow0,
  mockWorkflowTask0,
  mockWorkflowTask1
} from 'sartography-workflow-lib';
import { PreviousTaskButtonComponent } from './previous-task-button.component';

describe('PreviousTaskButtonComponent', () => {
  let httpMock: HttpTestingController;
  let component: PreviousTaskButtonComponent;
  let fixture: ComponentFixture<PreviousTaskButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousTaskButtonComponent ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
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
    fixture = TestBed.createComponent(PreviousTaskButtonComponent);
    component = fixture.componentInstance;
    component.workflow = mockWorkflow0;
    component.currentTask = mockWorkflowTask0;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check whether workflow has a previous task', () => {
    component.workflow.last_task = null;
    component.currentTask = mockWorkflowTask0;
    expect(component.hasPreviousTask).toBeFalse();

    component.workflow.last_task = mockWorkflowTask0;
    component.currentTask = mockWorkflowTask0;
    expect(component.hasPreviousTask).toBeFalse();

    component.workflow.last_task = mockWorkflowTask1;
    component.currentTask = mockWorkflowTask0;
    expect(component.hasPreviousTask).toBeTrue();
  });

  it('should go to previous task', () => {
    const workflowUpdatedSpy = spyOn(component.workflowUpdated, 'emit').and.stub();
    component.workflow.last_task = mockWorkflowTask0;
    component.currentTask = mockWorkflowTask1;

    component.previousTask();
    const req = httpMock.expectOne(`apiRoot/workflow/${mockWorkflow0.id}/task/${mockWorkflow0.last_task.id}/set_token`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockWorkflow0);

    expect(workflowUpdatedSpy).toHaveBeenCalledWith(mockWorkflow0);
  });
});
