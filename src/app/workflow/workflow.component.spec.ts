import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MarkdownModule, MarkdownService, MarkedOptions } from 'ngx-markdown';
import { cloneDeep } from 'lodash';
import { of } from 'rxjs';
import {
  ApiService, mockDocumentDirectory,
  MockEnvironment,
  mockNav0, mockNav1, mockStudy0,
  mockUser0, mockUser1,
  mockWorkflow0,
  mockWorkflow1,
  mockWorkflowTask0,
  mockWorkflowTask1, NavItemType,
  RadioDataFieldComponent,
  ToFormlyPipe, UserService,
  WorkflowNavItem,
  WorkflowTaskState,
  WorkflowTaskType
} from 'sartography-workflow-lib';
import { LoadingComponent } from '../loading/loading.component';
import { WorkflowFilesComponent } from '../workflow-files/workflow-files.component';
import { WorkflowFormComponent } from '../workflow-form/workflow-form.component';
import { WorkflowNavComponent } from '../workflow-nav/workflow-nav.component';
import { WorkflowResetDialogData } from '../workflow-reset-dialog/workflow-reset-dialog.component';
import { WorkflowStepsMenuListComponent } from '../workflow-steps-menu-list/workflow-steps-menu-list.component';
import { WorkflowComponent } from './workflow.component';

class MockMarkdownService {
  toHtml(text: string): string {
    return text
  };

  compile(markdown: string, decodeHtml?: boolean, emojify?: boolean, markedOptions?: MarkedOptions): string {
    return markdown
  };

  highlight(element?: Element | Document): void {
  };
}

function loadDefaultUser(httpMock: HttpTestingController,component: WorkflowComponent): void {
  const userReq = httpMock.expectOne('apiRoot/user');
  expect(userReq.request.method).toEqual('GET');
  userReq.flush(mockUser0);
  expect(component.isAdmin).toEqual(true);
  expect(component.showDataPane).toBeTrue();
}


describe('WorkflowComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;
  let httpMock: HttpTestingController;
  let user: UserService;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};
  const mockEnvironment = new MockEnvironment();



  beforeEach(waitForAsync(() => {
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
        UserService,
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
    localStorage.removeItem('admin_view_as');
    localStorage.setItem('token', 'some_token');
    httpMock = TestBed.inject(HttpTestingController);
    user = TestBed.inject(UserService);
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    mockEnvironment.hideDataPane = true;
    fixture.detectChanges();
    httpMock.expectOne('apiRoot/workflow/0/task/0/set_token')

  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });



  it('locked workflow should lock task', () => {
    loadDefaultUser(httpMock, component);
    component.updateWorkflow(mockWorkflow0);
    component.study = mockStudy0;
    expect(component.isLocked(component.currentTask)).toBeFalsy();
    component.workflow.state = 'locked';
    expect(component.isLocked(component.currentTask)).toBeTruthy();

    console.log('In my test: ');
  });

  it('should create', () => {
    loadDefaultUser(httpMock,component);
    expect(component).toBeTruthy();
  });

  it('should change selected task', () => {
    loadDefaultUser(httpMock,component);
    component.setCurrentTask(mockWorkflowTask0.id);
    httpMock.expectOne('apiRoot/workflow/0/task/0/set_token')
  });

  it('should update workflow', () => {
    loadDefaultUser(httpMock,component);
    const countdownSpy = spyOn(component, 'countdown').and.stub();
    component.updateWorkflow(mockWorkflow0);
    expect(component.workflow).toEqual(mockWorkflow0);
    expect(countdownSpy).not.toHaveBeenCalled();
    httpMock.expectOne('apiRoot/study/0?update_status=false')
    httpMock.expectOne('apiRoot/document_directory/0')
  });

  it('should not redirect on end event with documentation', () => {
    loadDefaultUser(httpMock,component);
    const countdownSpy = spyOn(component, 'countdown').and.stub();

    // Set the next task to be an end event with documentation
    const updatedWorkflow = cloneDeep(mockWorkflow1);
    const endEvent = cloneDeep(mockWorkflowTask1);
    endEvent.type = WorkflowTaskType.END_EVENT;
    endEvent.documentation = 'The Restaurant at the End of the Universe.';
    updatedWorkflow.next_task = endEvent;

    // Next task should be end event now, but countdown to redirect should not start
    component.updateWorkflow(updatedWorkflow);
    expect(component.workflow).toEqual(updatedWorkflow);
    expect(component.workflow.next_task).toEqual(endEvent, 'next task should be an end event');
    expect(component.workflow.redirect).toBeUndefined('workflow redirect seconds should not be set');
    expect(countdownSpy).not.toHaveBeenCalled();
    httpMock.expectOne('apiRoot/study/0?update_status=false')
    httpMock.expectOne('apiRoot/document_directory/0')
  });

  it('should redirect on end event without documentation', () => {
    loadDefaultUser(httpMock,component);
    const countdownSpy = spyOn(component, 'countdown').and.stub();

    // Set the next task to be an end event with no documentation
    const updatedWorkflow = cloneDeep(mockWorkflow1);
    const endEvent = cloneDeep(mockWorkflowTask1);
    endEvent.type = WorkflowTaskType.END_EVENT;
    endEvent.documentation = '';
    updatedWorkflow.next_task = endEvent;

    component.workflow = mockWorkflow1
    // Next task should be end event now, but should not redirect
    component.workflowUpdatedInForm(updatedWorkflow);
    expect(component.workflow).toEqual(updatedWorkflow);
    expect(component.workflow.next_task).toEqual(endEvent, 'next task should be an end event');
    expect(component.workflow.redirect).toEqual(1, 'workflow redirect seconds should be set');
    expect(countdownSpy).toHaveBeenCalled();
    httpMock.expectOne('apiRoot/study/0?update_status=false')
    httpMock.expectOne('apiRoot/document_directory/0')
  });

  it('should log task data', () => {
    loadDefaultUser(httpMock,component);
    const consoleGroupSpy = spyOn(console, 'group').and.stub();
    const consoleTableSpy = spyOn(console, 'table').and.stub();
    const consoleGroupEndSpy = spyOn(console, 'groupEnd').and.stub();
    const consoleLogSpy = spyOn(console, 'log').and.stub();

    const taskWithData = cloneDeep(mockWorkflowTask0);
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
    loadDefaultUser(httpMock,component);
    const updateSpy = spyOn(component, 'updateWorkflow').and.stub();
    component.workflow = mockWorkflow0
    component.completeManualTask(mockWorkflowTask0);

    const tReq = httpMock.expectOne(`apiRoot/workflow/${mockWorkflow0.id}/task/${mockWorkflowTask0.id}/data`);
    expect(tReq.request.method).toEqual('PUT');
    tReq.flush(mockWorkflow0);

    expect(updateSpy).toHaveBeenCalledWith(mockWorkflow0);
  });

  it('should determine whether there are incomplete tasks', () => {
    loadDefaultUser(httpMock,component);
    const workflowAllComplete = cloneDeep(mockWorkflow0);
    workflowAllComplete.navigation.forEach((n: WorkflowNavItem) => n.state = WorkflowTaskState.COMPLETED);
    component.workflow = workflowAllComplete;
    component.currentTask = undefined;
    expect(component.hasIncompleteUserTask()).toBeFalsy();

    const workflowNoneComplete = cloneDeep(mockWorkflow0);
    workflowNoneComplete.navigation.forEach((n: WorkflowNavItem) => n.state = WorkflowTaskState.FUTURE);
    component.workflow = workflowNoneComplete;
    component.currentTask = mockWorkflowTask0;
    component.currentTask.type = WorkflowTaskType.USER_TASK;
    component.currentTask.state = WorkflowTaskState.READY;
    expect(component.hasIncompleteUserTask()).toBeTruthy();
  });

  it('should toggle task data display', () => {
    loadDefaultUser(httpMock,component);
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
    loadDefaultUser(httpMock,component);
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
    loadDefaultUser(httpMock,component);
    component.workflow = mockWorkflow0
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
    loadDefaultUser(httpMock,component);
    component.resetWorkflow();
    httpMock.expectOne('apiRoot/workflow/0/restart?clear_data=false&delete_files=false')
  });

  it('AdminUser with hideDataPane=true should show button', () => {
    fixture.destroy();
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    mockEnvironment.hideDataPane = true;

    fixture.detectChanges();

    const userReq = httpMock.expectOne('apiRoot/user');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser0);
    expect(component.isAdmin).toEqual(true);
    expect(component.showDataPane).toBeTrue();
    httpMock.expectOne('apiRoot/workflow/0/task/0/set_token')
  });

  it('AdminUser with hideDataPane=false should show button', () => {
    fixture.destroy();
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    mockEnvironment.hideDataPane = false;

    fixture.detectChanges();

    const userReq = httpMock.expectOne('apiRoot/user');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser0);
    expect(component.isAdmin).toEqual(true);
    expect(component.showDataPane).toBeTrue();
    httpMock.expectOne('apiRoot/workflow/0/task/0/set_token')
  });

  it('Non-admin user with hideDataPane=false should hide button', () => {
    fixture.destroy();
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    mockEnvironment.hideDataPane = false;

    fixture.detectChanges();

    const userReq = httpMock.expectOne('apiRoot/user');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser1);
    expect(component.isAdmin).toEqual(false);
    expect(component.showDataPane).toBeTrue();
    httpMock.expectOne('apiRoot/workflow/0/task/0/set_token')
  });

  it('should report isOnlyTask', () => {
    loadDefaultUser(httpMock,component);
    component.workflow = mockWorkflow0
    component.workflow.navigation = JSON.parse(JSON.stringify(mockNav0));
    component.workflow.navigation[0] =
      {
        spec_id: 0, name: '', spec_type: NavItemType.USER_TASK, indent: 0
      };
    expect(component.isOnlyTask()).toBeTrue();
    component.workflow.navigation = mockNav1;
    expect(component.isOnlyTask()).toBeFalse();
  });
});


