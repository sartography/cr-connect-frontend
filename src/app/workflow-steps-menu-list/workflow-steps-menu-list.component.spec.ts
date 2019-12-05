import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';

import { WorkflowStepsMenuListComponent } from './workflow-steps-menu-list.component';

describe('WorkflowStepsMenuListComponent', () => {
  let component: WorkflowStepsMenuListComponent;
  let fixture: ComponentFixture<WorkflowStepsMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowStepsMenuListComponent ],
      imports: [
        MatIconModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowStepsMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
