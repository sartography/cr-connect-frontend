import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CategoryComponent} from './category.component';
import {
  ApiService,
  MockEnvironment,
  mockNav0,
  mockStudy0,
  mockWorkflowSpecCategory0, mockWorkflowTask0, WorkflowNavItem,
  WorkflowTaskState
} from 'sartography-workflow-lib';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatExpansionModule} from '@angular/material/expansion';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import createClone from 'rfdc';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let httpMock: HttpTestingController;
  const mockEnvironment = new MockEnvironment();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [
        HttpClientTestingModule,
        MatExpansionModule,
        MatListModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useValue: mockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    component.category = mockWorkflowSpecCategory0;
    component.study = mockStudy0;
    fixture.detectChanges();

    mockWorkflowSpecCategory0.workflows.forEach(wf => {
      const wfReq = httpMock.expectOne('apiRoot/workflow/' + wf.id);
      expect(wfReq.request.method).toEqual('GET');
      wfReq.flush(wf);
    });
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get workflow nav list for give workflow id', () => {
    const wf = component.workflows[0];
    expect(component.getNavForWorkflow(wf.id)).toEqual(wf.navigation);
  });

  it('should check if task is complete', () => {
    const navItem: WorkflowNavItem = createClone({circles: true})(mockNav0[0]);

    navItem.state = WorkflowTaskState.COMPLETED;
    expect(component.isTaskComplete(navItem)).toBeTrue();

    navItem.state = WorkflowTaskState.READY;
    expect(component.isTaskComplete(navItem)).toBeFalse();
  });
});
