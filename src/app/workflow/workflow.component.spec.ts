import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {MarkdownModule} from 'ngx-markdown';
import createClone from 'rfdc';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockStudy0,
  mockWorkflow0,
  mockWorkflow1,
  mockWorkflowTask0,
  mockWorkflowTasks,
  WorkflowTaskState,
  WorkflowTaskType,
  ToFormlyPipe, mockWorkflowSpec0, WorkflowTask, mockFileMetas
} from 'sartography-workflow-lib';
import {WorkflowFilesComponent} from '../workflow-files/workflow-files.component';
import {WorkflowFormComponent} from '../workflow-form/workflow-form.component';
import {WorkflowStepsMenuListComponent} from '../workflow-steps-menu-list/workflow-steps-menu-list.component';
import {WorkflowComponent} from './workflow.component';

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
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MarkdownModule
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
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const fReq = httpMock.expectOne('apiRoot/file?workflow_id=' + mockWorkflow0.id);
    expect(fReq.request.method).toEqual('GET');
    fReq.flush(mockFileMetas);
    expect(component.fileMetas).toEqual(mockFileMetas);

    const wf1Req = httpMock.expectOne('apiRoot/workflow/' + mockWorkflow0.id);
    expect(wf1Req.request.method).toEqual('GET');
    wf1Req.flush(mockWorkflow0);
    expect(component.workflow).toEqual(mockWorkflow0);

    const specReq = httpMock.expectOne('apiRoot/workflow-specification/' + mockWorkflowSpec0.id);
    expect(specReq.request.method).toEqual('GET');
    specReq.flush(mockWorkflowSpec0);
    expect(component.workflowSpec).toEqual(mockWorkflowSpec0);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change selected task', () => {
    const mockTask = Object.assign(new WorkflowTask(), mockWorkflowTask0);
    component.setCurrentTask(mockTask);
    expect(component.currentTask).toEqual(mockTask);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'study', mockStudy0.id, 'workflow', mockWorkflow0.id, 'task', mockTask.id
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
    // No currently-selected task
    (component as any).taskId = undefined;
    component.currentTask = undefined;

    (component as any).updateTaskList(mockWorkflow1.id);

    const fReq = httpMock.expectOne('apiRoot/file?workflow_id=' + mockWorkflow1.id);
    expect(fReq.request.method).toEqual('GET');
    fReq.flush(mockFileMetas);
    expect(component.fileMetas).toEqual(mockFileMetas);

    const tReq = httpMock.expectOne('apiRoot/workflow/' + mockWorkflow1.id);
    expect(tReq.request.method).toEqual('GET');
    tReq.flush(mockWorkflow0);

    const s1Req = httpMock.expectOne('apiRoot/workflow-specification/' + mockWorkflowSpec0.id);
    expect(s1Req.request.method).toEqual('GET');
    s1Req.flush(mockWorkflowSpec0);

    // Should select a task
    expect(component.currentTask).toBeTruthy();

    // Delete all tasks from workflow
    mockWorkflow0.last_task = undefined;
    mockWorkflow0.next_task = undefined;
    mockWorkflow0.user_tasks = [];
    (component as any).updateTaskList(mockWorkflow0.id);

    const f2Req = httpMock.expectOne('apiRoot/file?workflow_id=' + mockWorkflow0.id);
    expect(f2Req.request.method).toEqual('GET');
    f2Req.flush(mockFileMetas);
    expect(component.fileMetas).toEqual(mockFileMetas);

    const t2Req = httpMock.expectOne('apiRoot/workflow/' + mockWorkflow0.id);
    expect(t2Req.request.method).toEqual('GET');
    t2Req.flush(mockWorkflow0);

    const s2Req = httpMock.expectOne('apiRoot/workflow-specification/' + mockWorkflowSpec0.id);
    expect(s2Req.request.method).toEqual('GET');
    s2Req.flush(mockWorkflowSpec0);

    // Should be no task to select.
    expect(component.currentTask).toBeUndefined();
  });

  it('should log task data', () => {
    const consoleGroupSpy = spyOn(console, 'group').and.stub();
    const consoleTableSpy = spyOn(console, 'table').and.stub();
    const consoleGroupEndSpy = spyOn(console, 'groupEnd').and.stub();
    const consoleLogSpy = spyOn(console, 'log').and.stub();

    const taskWithData = createClone()(mockWorkflowTask0);
    taskWithData.data = {
      favorite_color: 'blue',
      favorite_number: '13',
    };
    component.logTaskData(taskWithData);
    expect(consoleGroupSpy).toHaveBeenCalled();
    expect(consoleTableSpy).toHaveBeenCalled();
    expect(consoleGroupEndSpy).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalled();

    // Log nothing if no task defined
    consoleGroupSpy.calls.reset();
    consoleTableSpy.calls.reset();
    consoleGroupEndSpy.calls.reset();
    consoleLogSpy.calls.reset();
    component.logTaskData(undefined);
    expect(consoleGroupSpy).not.toHaveBeenCalled();
    expect(consoleTableSpy).not.toHaveBeenCalled();
    expect(consoleGroupEndSpy).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('should complete manual task', () => {
    const updateSpy = spyOn(component, 'workflowUpdated').and.stub();
    component.completeManualTask(mockWorkflowTask0);

    const tReq = httpMock.expectOne(`apiRoot/workflow/${mockWorkflow0.id}/task/${mockWorkflowTask0.id}/data`);
    expect(tReq.request.method).toEqual('PUT');
    tReq.flush(mockWorkflow0);

    expect(updateSpy).toHaveBeenCalledWith(mockWorkflow0);
  });

  it('should determine whether there are incomplete tasks', () => {
    component.allTasks = [];
    expect(component.hasIncompleteUserTask()).toBeFalsy();

    component.allTasks = mockWorkflowTasks;
    component.currentTask = mockWorkflowTask0;
    component.currentTask.type = WorkflowTaskType.USER_TASK;
    component.currentTask.state = WorkflowTaskState.READY;
    expect(component.hasIncompleteUserTask()).toBeTruthy();
  });

  it('should toggle task data display', () => {
    const toggleFilesDisplaySpy = spyOn(component, 'toggleFilesDisplay').and.stub();
    component.toggleDataDisplay(true);
    expect(component.displayData).toBeTrue();
    expect(toggleFilesDisplaySpy).not.toHaveBeenCalled();

    toggleFilesDisplaySpy.calls.reset();
    component.displayData = true;
    component.toggleDataDisplay();
    expect(component.displayData).toBeFalse();
    expect(toggleFilesDisplaySpy).not.toHaveBeenCalled();

    toggleFilesDisplaySpy.calls.reset();
    component.displayData = false;
    component.toggleDataDisplay();
    expect(component.displayData).toBeTrue();
    expect(toggleFilesDisplaySpy).toHaveBeenCalled();
  });

  it('should toggle task files display', () => {
    const toggleDataDisplaySpy = spyOn(component, 'toggleDataDisplay').and.stub();
    component.toggleFilesDisplay(true);
    expect(component.displayFiles).toBeTrue();
    expect(toggleDataDisplaySpy).not.toHaveBeenCalled();

    toggleDataDisplaySpy.calls.reset();
    component.displayFiles = true;
    component.toggleFilesDisplay();
    expect(component.displayFiles).toBeFalse();
    expect(toggleDataDisplaySpy).not.toHaveBeenCalled();

    toggleDataDisplaySpy.calls.reset();
    component.displayFiles = false;
    component.toggleFilesDisplay();
    expect(component.displayFiles).toBeTrue();
    expect(toggleDataDisplaySpy).toHaveBeenCalled();
  });
});
