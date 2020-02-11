import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFilesComponent } from './workflow-files.component';
import {HttpTestingController} from '@angular/common/http/testing';
import {ApiService, MockEnvironment, mockStudy0, mockWorkflow0} from 'sartography-workflow-lib';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {of} from 'rxjs';

describe('WorkflowFilesComponent', () => {
  let component: WorkflowFilesComponent;
  let fixture: ComponentFixture<WorkflowFilesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkflowFilesComponent
      ],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0', workflow_id: '0', task_id: '0'}))}
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/files?workflow_id=' + mockWorkflow0.id);
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockStudy0);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
