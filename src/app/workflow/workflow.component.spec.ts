import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FormlyModule} from '@ngx-formly/core';
import {ToFormlyPipe} from '../_pipes/to-formly.pipe';
import {ApiService} from '../_services/api/api.service';
import {mockStudy0} from '../_testing/mocks/study.mocks';
import {mockWorkflowSpecs} from '../_testing/mocks/workflow-spec.mocks';
import {mockWorkflowTask0, mockWorkflowTasks} from '../_testing/mocks/workflow-task.mocks';
import {mockWorkflow0, mockWorkflow1, mockWorkflows} from '../_testing/mocks/workflow.mocks';
import {WorkflowFormComponent} from '../workflow-form/workflow-form.component';
import {WorkflowMenuItemComponent} from '../workflow-menu-item/workflow-menu-item.component';
import {WorkflowStepsMenuListComponent} from '../workflow-steps-menu-list/workflow-steps-menu-list.component';

import {WorkflowComponent} from './workflow.component';

describe('WorkflowComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToFormlyPipe,
        WorkflowComponent,
        WorkflowFormComponent,
        WorkflowMenuItemComponent,
        WorkflowStepsMenuListComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        FormlyModule,
        HttpClientTestingModule,
        MatIconModule,
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
          useValue: {snapshot: {paramMap: convertToParamMap({study_id: '0', workflow_id: '0'})}}
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('http://localhost:5000/v1.0/study/' + mockStudy0.id);
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockStudy0);

    expect(component.study).toBeTruthy();
    expect(component.study.id).toEqual(mockStudy0.id);

    const swsReq = httpMock.expectOne('http://localhost:5000/v1.0/study/' + mockStudy0.id + '/workflows');
    expect(swsReq.request.method).toEqual('GET');
    swsReq.flush(mockWorkflows);

    expect(component.studyWorkflows).toBeTruthy();
    expect(component.studyWorkflows[0].id).toEqual(mockWorkflow0.id);

    const wfsReq = httpMock.expectOne('http://localhost:5000/v1.0/workflow-specification');
    expect(wfsReq.request.method).toEqual('GET');
    wfsReq.flush(mockWorkflowSpecs);

    for (const wf of component.studyWorkflows) {
      expect(wf.workflow_spec).toBeTruthy();
      expect(wf.workflow_spec.id).toEqual(wf.workflow_spec_id);
    }

    const t1Req = httpMock.expectOne('http://localhost:5000/v1.0/workflow/' + mockWorkflow0.id + '/tasks');
    expect(t1Req.request.method).toEqual('GET');
    t1Req.flush(mockWorkflowTasks);

    const t2Req = httpMock.expectOne('http://localhost:5000/v1.0/workflow/' + mockWorkflow1.id + '/tasks');
    expect(t2Req.request.method).toEqual('GET');
    t2Req.flush(mockWorkflowTasks);

    for (const wf of component.studyWorkflows) {
      expect(wf.workflow_tasks).toBeTruthy();
      expect(wf.workflow_tasks[0].id).toEqual(mockWorkflowTask0.id);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
