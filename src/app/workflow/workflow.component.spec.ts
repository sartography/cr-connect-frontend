import {APP_BASE_HREF} from '@angular/common';
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
import {MarkdownModule, MarkdownService, MarkedOptions} from 'ngx-markdown';
import createClone from 'rfdc';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockFileMetas,
  mockWorkflow0,
  mockWorkflow1,
  mockWorkflowTask0,
  mockWorkflowTask1,
  mockUser0,
  mockUser1,
  ToFormlyPipe,
  WorkflowNavItem,
  WorkflowTaskState,
  WorkflowTaskType,
  RadioDataFieldComponent
} from 'sartography-workflow-lib';
import {WorkflowFilesComponent} from '../workflow-files/workflow-files.component';
import {WorkflowFormComponent} from '../workflow-form/workflow-form.component';
import {WorkflowStepsMenuListComponent} from '../workflow-steps-menu-list/workflow-steps-menu-list.component';
import {WorkflowComponent} from './workflow.component';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {LoadingComponent} from '../loading/loading.component';
import {DeviceDetectorService} from 'ngx-device-detector';
import {WorkflowResetDialogData} from '../workflow-reset-dialog/workflow-reset-dialog.component';
import {Mock} from 'protractor/built/driverProviders';
import {WorkflowNavComponent} from '../workflow-nav/workflow-nav.component';

class MockMarkdownService {
  toHtml(text:string):string {return text};
  compile(markdown: string, decodeHtml?: boolean, emojify?: boolean, markedOptions?: MarkedOptions): string {return markdown};
  highlight(element?: Element | Document): void {};
}

describe('WorkflowComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;
  let httpMock: HttpTestingController;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};
  const mockEnvironment = new MockEnvironment();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToFormlyPipe,
        WorkflowComponent,
        WorkflowFormComponent,
        WorkflowStepsMenuListComponent,
        WorkflowFilesComponent,
        LoadingComponent,
        WorkflowNavComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        FormlyMaterialModule,
        FormlyModule.forRoot({
          types: [
            {name: 'radio_data', component: RadioDataFieldComponent, wrappers: ['form-field']},
          ]
        }),
        HttpClientTestingModule,
        MatButtonModule,
        MatBadgeModule,
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
        {provide: 'APP_ENVIRONMENT', useValue: mockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        DeviceDetectorService,
        {provide: MarkdownService, useClass: MockMarkdownService},


      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const wf1Req = httpMock.expectOne('apiRoot/workflow/' + mockWorkflow0.id);
    expect(wf1Req.request.method).toEqual('GET');
    wf1Req.flush(mockWorkflow0);
    expect(component.workflow).toEqual(mockWorkflow0);

    const fReq = httpMock.expectOne('apiRoot/file?workflow_id=' + mockWorkflow0.id);
    expect(fReq.request.method).toEqual('GET');
    fReq.flush(mockFileMetas);
    expect(component.fileMetas).toEqual(mockFileMetas);

  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change selected task', () => {
    const updateUrlSpy = spyOn(component, 'updateUrl').and.stub();
    component.setCurrentTask(mockWorkflowTask0.id);

    const specReq = httpMock.expectOne(`apiRoot/workflow/${mockWorkflow0.id}/task/${mockWorkflowTask0.id}/set_token`);
    expect(specReq.request.method).toEqual('PUT');
    specReq.flush(mockWorkflow0);
    expect(component.workflow).toEqual(mockWorkflow0);
    expect(component.currentTask).toEqual(mockWorkflow0.next_task);
    expect(updateUrlSpy).toHaveBeenCalled();
  });

  it('should update workflow', () => {
    const countdownSpy = spyOn(component, 'countdown').and.stub();
    const updateTaskListSpy = spyOn((component as any), 'updateTaskList').and.stub();
    component.workflowUpdated(mockWorkflow1);
    expect(component.workflow).toEqual(mockWorkflow1);
    expect(component.currentTask).toBeUndefined();
    expect(updateTaskListSpy).toHaveBeenCalledWith(mockWorkflow1);
    expect(countdownSpy).not.toHaveBeenCalled();
  });

  it('should not redirect on end event with documentation', () => {
    const countdownSpy = spyOn(component, 'countdown').and.stub();
    const updateTaskListSpy = spyOn((component as any), 'updateTaskList').and.stub();

    // Set the next task to be an end event with documentation
    const updatedWorkflow = createClone()(mockWorkflow1);
    const endEvent = createClone()(mockWorkflowTask1);
    endEvent.type = WorkflowTaskType.END_EVENT;
    endEvent.documentation = 'The Restaurant at the End of the Universe.'
    updatedWorkflow.next_task = endEvent;

    // Next task should be end event now, but countdown to redirect should not start
    component.workflowUpdated(updatedWorkflow);
    expect(component.workflow).toEqual(updatedWorkflow);
    expect(component.workflow.next_task).toEqual(endEvent, 'next task should be an end event');
    expect(component.workflow.redirect).toBeUndefined('workflow redirect seconds should not be set');
    expect(countdownSpy).not.toHaveBeenCalled();
    expect(updateTaskListSpy).toHaveBeenCalledWith(updatedWorkflow);
  });

  it('should redirect on end event without documentation', () => {
    const countdownSpy = spyOn(component, 'countdown').and.stub();
    const updateTaskListSpy = spyOn((component as any), 'updateTaskList').and.stub();

    // Set the next task to be an end event with no documentation
    const updatedWorkflow = createClone()(mockWorkflow1);
    const endEvent = createClone()(mockWorkflowTask1);
    endEvent.type = WorkflowTaskType.END_EVENT;
    endEvent.documentation = ''
    updatedWorkflow.next_task = endEvent;

    // Next task should be end event now, but should not redirect
    component.workflowUpdated(updatedWorkflow);
    expect(component.workflow).toEqual(updatedWorkflow);
    expect(component.workflow.next_task).toEqual(endEvent, 'next task should be an end event');
    expect(component.workflow.redirect).toEqual(1, 'workflow redirect seconds should be set');
    expect(countdownSpy).toHaveBeenCalled();
    expect(updateTaskListSpy).toHaveBeenCalledWith(updatedWorkflow);
  });

  it('should set current task when updating task list', () => {
    // No currently-selected task
    (component as any).taskId = undefined;
    component.currentTask = undefined;

    (component as any).updateTaskList(mockWorkflow1);

    const fReq = httpMock.expectOne('apiRoot/file?workflow_id=' + mockWorkflow1.id);
    expect(fReq.request.method).toEqual('GET');
    fReq.flush(mockFileMetas);
    expect(component.fileMetas).toEqual(mockFileMetas);

    // Should select a task
    expect(component.currentTask).toBeTruthy();

    // Delete all tasks from workflow
    mockWorkflow0.next_task = undefined;
    (component as any).updateTaskList(mockWorkflow0);

    const f2Req = httpMock.expectOne('apiRoot/file?workflow_id=' + mockWorkflow0.id);
    expect(f2Req.request.method).toEqual('GET');
    f2Req.flush(mockFileMetas);
    expect(component.fileMetas).toEqual(mockFileMetas);

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
    const workflowAllComplete = createClone({circles: true})(mockWorkflow0);
    workflowAllComplete.navigation.forEach((n: WorkflowNavItem) => n.state = WorkflowTaskState.COMPLETED);
    component.workflow = workflowAllComplete;
    component.currentTask = undefined;
    expect(component.hasIncompleteUserTask()).toBeFalsy();

    const workflowNoneComplete = createClone({circles: true})(mockWorkflow0);
    workflowNoneComplete.navigation.forEach((n: WorkflowNavItem) => n.state = WorkflowTaskState.FUTURE);
    component.workflow = workflowNoneComplete;
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

  it('should show a confirmation dialog before resetting a workflow', () => {
    const mockConfirmDeleteData: WorkflowResetDialogData = {
      workflowId: component.workflowId,
      name: component.workflow.title,
    };

    const resetWorkflowSpy = spyOn(component, 'resetWorkflow').and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockConfirmDeleteData)} as any);

    component.confirmResetWorkflow();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(resetWorkflowSpy).not.toHaveBeenCalled();

    mockConfirmDeleteData.confirm = true;
    component.confirmResetWorkflow();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(resetWorkflowSpy).toHaveBeenCalled();
  });

  it('should reset a workflow', () => {
    const updateTaskListSpy = spyOn((component as any), 'updateTaskList').and.stub();
    (component as any).resetWorkflow();
    const wfsReq = httpMock.expectOne(`apiRoot/workflow/${component.workflowId}?hard_reset=true`);
    expect(wfsReq.request.method).toEqual('GET');
    wfsReq.flush(null);

    expect(updateTaskListSpy).toHaveBeenCalled();
  });

  it('AdminUser with hideDataPane=true should show button', () => {
    mockEnvironment.hideDataPane = true;
    fixture.detectChanges()
    const userReq = httpMock.expectOne('apiRoot/user');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser0);
    expect(component.isAdmin).toEqual(true);
    expect(component.showDataPane).toBeTrue();
  });


});
