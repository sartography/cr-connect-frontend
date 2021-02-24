import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDialogComponent } from './workflow-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

describe('WorkflowDialogComponent', () => {
  let component: WorkflowDialogComponent;
  let fixture: ComponentFixture<WorkflowDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDialogComponent ],
      imports: [
        MatDialogModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
