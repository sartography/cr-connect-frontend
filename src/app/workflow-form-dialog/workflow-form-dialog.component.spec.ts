import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFormDialogComponent } from './workflow-form-dialog.component';

describe('WorkflowFormDialogComponent', () => {
  let component: WorkflowFormDialogComponent;
  let fixture: ComponentFixture<WorkflowFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should autofocus on the OK button', () => {
    const input = fixture.nativeElement.querySelector('button:focus');
    expect(input).toBeTruthy();
  });
});
