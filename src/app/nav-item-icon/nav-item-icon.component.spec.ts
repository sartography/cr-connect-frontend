import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import * as cloneDeep from "lodash/cloneDeep";

import {
  mockNav0, mockTaskEvent0,
  mockWorkflowMeta0, NavItemType, TaskEvent, WorkflowNavItem,
  WorkflowStatus,
  WorkflowTaskState,
} from 'sartography-workflow-lib';
import {NavItemIconComponent} from './nav-item-icon.component';

describe('NavItemIconComponent', () => {
  let component: NavItemIconComponent;
  let fixture: ComponentFixture<NavItemIconComponent>;

  beforeEach(waitForAsync(() => {
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
    const workflowMeta = cloneDeep(mockWorkflowMeta0);
    const statuses = Object.values(WorkflowStatus);
    component.workflowMeta = workflowMeta;
    statuses.forEach(s => {
      workflowMeta.status = s;
      component.update_icon();
      expect(component.icon).toBeTruthy('no icon for ' + s);
      numPassed++;
    });

    expect(numPassed).toEqual(statuses.length);
  });

  it('should get icons for all task event statuses', () => {
    let numPassed = 0;
    const taskEvent: TaskEvent = cloneDeep(mockTaskEvent0);
    const states = Object.values(WorkflowTaskState);
    component.taskEvent = taskEvent;
    states.forEach(s => {
      taskEvent.task_state = s;
      component.update_icon();
      expect(component.icon).toBeTruthy('no icon for ' + s);
      numPassed++;
    });

    expect(numPassed).toEqual(states.length);
  });

  it('should get icons for workflow nav item statuses', () => {
    let numPassed = 0;
    const navItem: WorkflowNavItem = cloneDeep(mockNav0[0]);
    const states = Object.values(WorkflowTaskState);
    component.navItem = navItem;
    states.forEach(s => {
      navItem.state = s;
      if(navItem.spec_type === NavItemType.USER_TASK) {
        expect(component.icon).toBeTruthy();
      }
      numPassed++;
    });

    expect(numPassed).toEqual(states.length);
  });
});
