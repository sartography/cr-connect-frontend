import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {mockFileMeta0, mockStudy0} from 'sartography-workflow-lib';
import {ConfirmStudyStatusDialogData} from '../../_interfaces/dialog-data';
import {ConfirmStudyStatusDialogComponent} from './confirm-study-status-dialog.component';
import {StudyAction} from '../../_interfaces/study-action';

describe('DeleteFileDialogComponent', () => {
  let component: ConfirmStudyStatusDialogComponent;
  let fixture: ComponentFixture<ConfirmStudyStatusDialogComponent>;
  const mockAction: StudyAction = {
    showIf: () => true,
    buttonIcon: '',
    buttonLabel: '',
    tooltipText: '',
    dialogTitle: '',
    dialogDescription: '',
    dialogFormFields: [],
    method: '',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [ConfirmStudyStatusDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            action: mockAction,
            confirm: false,
            study: mockStudy0,
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmStudyStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm deletion on submit', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const expectedData: ConfirmStudyStatusDialogData = {action: mockAction, confirm: true, study: mockStudy0, model: undefined};
    component.data.study = mockStudy0;
    component.onSubmit();
    expect(closeSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should not change data on cancel', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith();
  });
});
