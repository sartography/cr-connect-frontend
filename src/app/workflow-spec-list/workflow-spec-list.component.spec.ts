import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatListModule} from '@angular/material/list';
import {ApiService} from '../_services/api/api.service';
import {mockWorkflowSpecs} from '../_testing/mocks/workflow-spec.mocks';

import { WorkflowSpecListComponent } from './workflow-spec-list.component';

describe('WorkflowSpecListComponent', () => {
  let component: WorkflowSpecListComponent;
  let fixture: ComponentFixture<WorkflowSpecListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowSpecListComponent ],
      imports: [
        HttpClientTestingModule,
        MatListModule,
      ],
      providers: [ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowSpecListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('http://localhost:5000/v1.0/workflow-specification');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockWorkflowSpecs);

    expect(component.workflowSpecs).toBeTruthy();
    expect(component.workflowSpecs.length).toEqual(mockWorkflowSpecs.length);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
