import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterTestingModule} from '@angular/router/testing';
import {mockStudies} from '../_testing/mocks/study.mocks';
import {workflowProcesses} from '../_testing/mocks/workflow.mocks';
import {WorkflowStepsMenuListComponent} from '../workflow-steps-menu-list/workflow-steps-menu-list.component';

import { WorkflowProcessMenuItemComponent } from './workflow-process-menu-item.component';

describe('WorkflowProcessMenuItemComponent', () => {
  let component: WorkflowProcessMenuItemComponent;
  let fixture: ComponentFixture<WorkflowProcessMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkflowProcessMenuItemComponent,
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
    fixture = TestBed.createComponent(WorkflowProcessMenuItemComponent);
    component = fixture.componentInstance;
    component.study = mockStudies[0];
    component.process = workflowProcesses[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
