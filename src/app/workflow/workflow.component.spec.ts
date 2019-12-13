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
import {ApiService} from '../_services/api/api.service';
import {studies, workflowProcesses} from '../_services/api/api.service.spec';
import {WorkflowProcessMenuItemComponent} from '../workflow-process-menu-item/workflow-process-menu-item.component';
import {WorkflowProcessComponent} from '../workflow-process/workflow-process.component';
import {WorkflowStepsMenuListComponent} from '../workflow-steps-menu-list/workflow-steps-menu-list.component';

import {WorkflowComponent} from './workflow.component';

describe('WorkflowComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkflowComponent,
        WorkflowProcessComponent,
        WorkflowProcessMenuItemComponent,
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
          useValue: {snapshot: {paramMap: convertToParamMap({study_id: '0', workflow_process_id: '0'})}}
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

    const sReq = httpMock.expectOne('/assets/json/study.json');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(studies);

    expect(component.study).toBeTruthy();
    expect(component.study.id).toEqual(studies[0].id);

    const pReq = httpMock.expectOne('/assets/json/workflow_process.json');
    expect(pReq.request.method).toEqual('GET');
    pReq.flush(workflowProcesses);

    expect(component.process).toBeTruthy();
    expect(component.process.id).toEqual(workflowProcesses[0].id);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
