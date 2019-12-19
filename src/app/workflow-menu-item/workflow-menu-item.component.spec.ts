import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterTestingModule} from '@angular/router/testing';
import {mockStudies} from '../_testing/mocks/study.mocks';
import {mockWorkflows} from '../_testing/mocks/workflow.mocks';
import {WorkflowStepsMenuListComponent} from '../workflow-steps-menu-list/workflow-steps-menu-list.component';

import { WorkflowMenuItemComponent } from './workflow-menu-item.component';

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
    component.study = mockStudies[0];
    component.workflow = mockWorkflows[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
