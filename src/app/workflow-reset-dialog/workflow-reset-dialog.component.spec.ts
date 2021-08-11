import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {mockWorkflow0, mockWorkflowSpec0} from 'sartography-workflow-lib';

import { WorkflowResetDialogComponent } from './workflow-reset-dialog.component';

describe('WorkflowResetDialogComponent', () => {
  let component: WorkflowResetDialogComponent;
  let fixture: ComponentFixture<WorkflowResetDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [ WorkflowResetDialogComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: {
          name: mockWorkflowSpec0.display_name,
          workflowId: mockWorkflow0.id
        }},
      ]
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

  it('should toggle clear data', () => {
    expect(component.clearData).toBeFalse();
    component.toggleClearData();
    expect(component.clearData).toBeTrue();
  });

  it('should toggle delete Files', () => {
    expect(component.deleteFiles).toBeFalse();
    component.toggleDeleteFiles();
    expect(component.deleteFiles).toBeTrue();
  });

  it('should disable delete Files if not clearing data', () => {
    component.toggleClearData();
    component.toggleDeleteFiles();
    expect(component.deleteFiles).toBeTrue();
    component.toggleClearData();
    expect(component.deleteFiles).toBeFalse();

  });

});
