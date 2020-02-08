import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {SimpleChanges} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockWorkflow0,
  mockWorkflowSpec0, mockWorkflowTask0, mockWorkflowTask1,
  mockWorkflowTasks
} from 'sartography-workflow-lib';
import {ToFormlyPipe} from '../_pipes/to-formly.pipe';

import {WorkflowFormComponent} from './workflow-form.component';

describe('WorkflowFormComponent', () => {
  let httpMock: HttpTestingController;
  let component: WorkflowFormComponent;
  let fixture: ComponentFixture<WorkflowFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToFormlyPipe,
        WorkflowFormComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        FormlyMaterialModule,
        FormlyModule.forRoot(),
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,

      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowFormComponent);
    component = fixture.componentInstance;
    const wf = mockWorkflow0;
    wf.user_tasks = mockWorkflowTasks;
    wf.workflow_spec = mockWorkflowSpec0;

    component.workflow = wf;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle changes', () => {
    const loadModelSpy = spyOn((component as any), '_loadModel').and.stub();
    const changes: SimpleChanges = {
      task: {
        previousValue: mockWorkflowTask0,
        currentValue: mockWorkflowTask1,
        firstChange: false,
        isFirstChange: (): boolean => false
      }
    };
    component.ngOnChanges(changes);
    expect(loadModelSpy).toHaveBeenCalledWith(mockWorkflowTask1);
  });

  it('should save task data', () => {
    const emitSpy = spyOn(component.workflowUpdated, 'emit').and.stub();
    spyOn((component as any).api, 'updateTaskDataForWorkflow').and.returnValue(of(mockWorkflow0));
    component.saveTaskData(mockWorkflowTask0);
    expect(emitSpy).toHaveBeenCalledWith(mockWorkflow0);
  });

  it('should load task data into Formly model', () => {
    mockWorkflowTask0.data = {bingbong: 'blorpglop'};
    (component as any)._loadModel(mockWorkflowTask0);
    expect(component.model).toEqual({bingbong: 'blorpglop'});
  });
});
