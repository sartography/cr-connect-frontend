import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowResetDialogComponent } from './workflow-reset-dialog.component';

describe('WorkflowResetDialogComponent', () => {
  let component: WorkflowResetDialogComponent;
  let fixture: ComponentFixture<WorkflowResetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowResetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowResetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
