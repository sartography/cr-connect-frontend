import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {FormlyModule} from '@ngx-formly/core';
import {ApiService} from '../_services/api/api.service';
import {workflowProcesses} from '../_services/api/api.service.spec';
import {WorkflowProcessMenuItemComponent} from '../workflow-process-menu-item/workflow-process-menu-item.component';
import {WorkflowProcessComponent} from '../workflow-process/workflow-process.component';
import {WorkflowStepsMenuListComponent} from '../workflow-steps-menu-list/workflow-steps-menu-list.component';

import {WorkflowComponent} from './workflow.component';
import {WorkflowFilesComponent} from "../workflow-files/workflow-files.component";

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
        WorkflowFilesComponent
      ],
      imports: [
        BrowserAnimationsModule,
        FormlyModule,
        HttpClientTestingModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [ApiService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('/assets/json/workflow_process.json');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(workflowProcesses);

    expect(component.process).toBeTruthy();
    expect(component.process.id).toEqual(workflowProcesses[0].id);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
