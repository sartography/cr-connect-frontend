import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterTestingModule} from '@angular/router/testing';
import {mockStudy0, mockWorkflows, mockWorkflowSpec0, mockWorkflowTasks} from 'sartography-workflow-lib';
import {WorkflowStepsMenuListComponent} from '../workflow-steps-menu-list/workflow-steps-menu-list.component';

import {WorkflowMenuItemComponent} from './workflow-menu-item.component';

describe('WorkflowMenuItemComponent', () => {
  let component: WorkflowMenuItemComponent;
  let fixture: ComponentFixture<WorkflowMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkflowMenuItemComponent,
        WorkflowStepsMenuListComponent,
      ],
      imports: [
        MatIconModule,
        MatListModule,
        RouterTestingModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(WorkflowMenuItemComponent);
    component = fixture.componentInstance;
    component.study = mockStudy0;

    const sws = mockWorkflows;
    sws.forEach(wf => {
      wf.workflow_tasks = mockWorkflowTasks;
      wf.workflow_spec = mockWorkflowSpec0;
    });

    component.studyWorkflows = sws;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
