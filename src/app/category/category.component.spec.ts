import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CategoryComponent} from './category.component';
import {
  ApiService,
  MockEnvironment,
  mockNav0,
  mockStudy0,
  mockWorkflow0,
  mockWorkflowSpecCategory0, mockWorkflowTask0, mockWorkflowTasks,
  WorkflowNavItem,
  WorkflowTaskState,
  WorkflowTaskType
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
        {provide: APP_BASE_HREF, useValue: '/'},
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
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get workflow nav list for selected workflow', () => {
    component.selectedWorkflow = createClone({circles: true})(mockWorkflow0);

    // fixme: Add some tests in here that make good sense, and look at state, and type not task
    /*
    // Set all tasks to undefined
    component.selectedWorkflow.navigation.forEach(navItem => navItem. = undefined);
    expect(component.navItems).toEqual([], 'should filter non-user tasks from nav');

    // Set all tasks to a NONE_TASK
    const noneTask = createClone()(mockWorkflowTask0);
    noneTask.type = WorkflowTaskType.NONE_TASK;
    component.selectedWorkflow.navigation.forEach(navItem => navItem.task = noneTask);
    expect(component.navItems).toEqual([], 'should filter none tasks from nav');
    // Set all tasks to a USER_TASK
    const userTask = createClone()(mockWorkflowTask0);
    userTask.type = WorkflowTaskType.USER_TASK;
    component.selectedWorkflow.navigation.forEach(navItem => navItem.task = mockWorkflowTask0);
    expect(component.navItems).toEqual(component.selectedWorkflow.navigation, 'should include user tasks in nav');
     */
  });

  it('should check if task is complete', () => {
    const navItem: WorkflowNavItem = createClone({circles: true})(mockNav0[0]);

    navItem.state = WorkflowTaskState.COMPLETED;
    expect(component.isTaskComplete(navItem)).toBeTrue();

    navItem.state = WorkflowTaskState.READY;
    expect(component.isTaskComplete(navItem)).toBeFalse();
  });
});
