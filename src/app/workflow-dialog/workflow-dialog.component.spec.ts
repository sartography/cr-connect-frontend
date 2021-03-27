import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { WorkflowDialogComponent } from './workflow-dialog.component';

describe('WorkflowDialogComponent', () => {
  let component: WorkflowDialogComponent;
  let fixture: ComponentFixture<WorkflowDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDialogComponent ],
      imports: [MatDialogModule],
      providers: [
        {
        provide: MatDialogRef,
        useValue: []
         },
        {
        provide: MAT_DIALOG_DATA,
        useValue: []
        }
        ]
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

  it('should autofocus on the OK button', () => {
    const ok_button = fixture.nativeElement.querySelector('#ok');
    const active_element = fixture.nativeElement.querySelector(':focus');
    expect(ok_button).toBe(active_element);
  });

});
