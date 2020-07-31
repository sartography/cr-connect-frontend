import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import createClone from 'rfdc';
import {
  mockNav0, mockTaskEvent0,
  mockWorkflowStats0, TaskEvent, WorkflowNavItem,
  WorkflowStatus,
  WorkflowTaskState,
  WorkflowTaskType
} from 'sartography-workflow-lib';
import {NavItemIconComponent} from './nav-item-icon.component';

describe('NavItemIconComponent', () => {
  let component: NavItemIconComponent;
  let fixture: ComponentFixture<NavItemIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavItemIconComponent],
      imports: [MatIconModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavItemIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get icons for all workflow statuses', () => {
    let numPassed = 0;
    const workflowStats = createClone({circles: true})(mockWorkflowStats0);
    const statuses = Object.values(WorkflowStatus);
    component.workflowStats = workflowStats;
    statuses.forEach(s => {
      workflowStats.status = s;
      expect(component.icon).toBeTruthy();
      numPassed++;
    });

    expect(numPassed).toEqual(statuses.length);
  });

  it('should get icons for all task event statuses', () => {
    let numPassed = 0;
    const taskEvent: TaskEvent = createClone({circles: true})(mockTaskEvent0);
    const states = Object.values(WorkflowTaskState);
    component.taskEvent = taskEvent;
    states.forEach(s => {
      taskEvent.task_state = s;
      expect(component.icon).toBeTruthy();
      numPassed++;
    });

    expect(numPassed).toEqual(states.length);
  });

  it('should get icons for workflow nav item statuses', () => {
    let numPassed = 0;
    const navItem: WorkflowNavItem = createClone({circles: true})(mockNav0[0]);
    const states = Object.values(WorkflowTaskState);
    component.navItem = navItem;
    states.forEach(s => {
      navItem.state = s;
      expect(component.icon).toBeTruthy();
      numPassed++;
    });

    expect(numPassed).toEqual(states.length);
  });
});
