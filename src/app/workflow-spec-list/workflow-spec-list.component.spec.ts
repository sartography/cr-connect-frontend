import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatListModule} from '@angular/material/list';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment, mockWorkflowSpecs} from 'sartography-workflow-lib';
import {WorkflowSpecListComponent} from './workflow-spec-list.component';

describe('WorkflowSpecListComponent', () => {
  let component: WorkflowSpecListComponent;
  let fixture: ComponentFixture<WorkflowSpecListComponent>;
  let httpMock: HttpTestingController;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowSpecListComponent],
      imports: [
        HttpClientTestingModule,
        MatListModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useValue: mockRouter},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowSpecListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/workflow-specification');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockWorkflowSpecs);

    expect(component.workflowSpecs).toBeTruthy();
    expect(component.workflowSpecs.length).toEqual(mockWorkflowSpecs.length);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
