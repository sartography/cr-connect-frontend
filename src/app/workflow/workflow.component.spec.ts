import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockStudy0,
  mockWorkflow0,
  mockWorkflow1,
  mockWorkflowTask0,
  mockWorkflowTask1,
  mockWorkflowTasks
} from 'sartography-workflow-lib';
import {ToFormlyPipe} from '../_pipes/to-formly.pipe';
import {WorkflowFormComponent} from '../workflow-form/workflow-form.component';
import {WorkflowStepsMenuListComponent} from '../workflow-steps-menu-list/workflow-steps-menu-list.component';

import {WorkflowComponent} from './workflow.component';
import {WorkflowFilesComponent} from '../workflow-files/workflow-files.component';

describe('WorkflowComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;
  let httpMock: HttpTestingController;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToFormlyPipe,
        WorkflowComponent,
        WorkflowFormComponent,
        WorkflowStepsMenuListComponent,
        WorkflowFilesComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        FormlyMaterialModule,
        FormlyModule.forRoot(),
        HttpClientTestingModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0', workflow_id: '0', task_id: '0'}))}
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const wf1Req = httpMock.expectOne('apiRoot/workflow/' + mockWorkflow0.id);
    expect(wf1Req.request.method).toEqual('GET');
    wf1Req.flush(mockWorkflow0);
    expect(component.workflow).toEqual(mockWorkflow0);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change selected task', () => {
    component.setCurrentTask(mockWorkflowTask0);
    expect(component.currentTask).toEqual(mockWorkflowTask0);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'study', mockStudy0.id, 'workflow', mockWorkflow0.id, 'task', mockWorkflowTask0.id
    ]);
  });

  it('should update workflow', () => {
    const updateTaskListSpy = spyOn((component as any), 'updateTaskList').and.stub();
    component.workflowUpdated(mockWorkflow1);
    expect(component.workflow).toEqual(mockWorkflow1);
    expect((component as any).taskId).toBeUndefined();
    expect(component.currentTask).toBeUndefined();
    expect(updateTaskListSpy).toHaveBeenCalledWith(mockWorkflow1.id);
  });

  it('should set current task when updating task list', () => {
    const setCurrentTaskSpy = spyOn(component, 'setCurrentTask').and.stub();

    // No currently-selected task
    (component as any).taskId = undefined;
    component.currentTask = undefined;

    (component as any).updateTaskList(mockWorkflow1.id);

    const tReq = httpMock.expectOne('apiRoot/workflow/' + mockWorkflow1.id);
    expect(tReq.request.method).toEqual('GET');
    tReq.flush(mockWorkflow0);

    // Should select a task
    expect(setCurrentTaskSpy).toHaveBeenCalledWith(mockWorkflowTask1);

    // Delete all tasks from workflow
    setCurrentTaskSpy.calls.reset();
    mockWorkflow0.last_task = undefined;
    mockWorkflow0.next_task = undefined;
    mockWorkflow0.user_tasks = [];
    (component as any).updateTaskList(mockWorkflow0.id);

    const t2Req = httpMock.expectOne('apiRoot/workflow/' + mockWorkflow0.id);
    expect(t2Req.request.method).toEqual('GET');
    t2Req.flush(mockWorkflow0);

    // Should be no task to select.
    expect(setCurrentTaskSpy).not.toHaveBeenCalled();
    expect(component.currentTask).toBeUndefined();
  });
});
