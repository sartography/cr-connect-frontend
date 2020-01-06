import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {ToFormlyPipe} from '../_pipes/to-formly.pipe';
import {ApiService} from '../_services/api/api.service';
import {mockStudy0} from '../_testing/mocks/study.mocks';
import {mockWorkflowSpec0} from '../_testing/mocks/workflow-spec.mocks';
import {mockWorkflowTasks} from '../_testing/mocks/workflow-task.mocks';
import {mockWorkflow0} from '../_testing/mocks/workflow.mocks';

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
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowFormComponent);
    component = fixture.componentInstance;
    component.study = mockStudy0;
    const wf = mockWorkflow0;
    wf.workflow_tasks = mockWorkflowTasks;
    wf.workflow_spec = mockWorkflowSpec0;

    component.workflow = wf;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
