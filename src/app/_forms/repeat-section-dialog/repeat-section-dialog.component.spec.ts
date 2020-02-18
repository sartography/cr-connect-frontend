import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyFieldConfig, FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {DeviceDetectorService} from 'ngx-device-detector';
import {RepeatSectionDialogComponent} from './repeat-section-dialog.component';

describe('RepeatSectionDialogComponent', () => {
  let component: RepeatSectionDialogComponent;
  let fixture: ComponentFixture<RepeatSectionDialogComponent>;
  const mockFields: FormlyFieldConfig[] = [
    {key: 'first_field', type: 'input', templateOptions: {label: 'first field'}},
    {key: 'second_field', type: 'input', templateOptions: {label: 'second field'}},
    {
      key: 'third_field', type: 'radio', templateOptions: {
        label: 'third field',
        options: [
          {label: 'Option A', value: 'a'},
          {label: 'Option B', value: 'b'},
          {label: 'Option C', value: 'c'},
        ]
      }
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      declarations: [
        RepeatSectionDialogComponent
      ],
      providers: [
        DeviceDetectorService,
        {provide: MatDialogRef, useValue: {}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Happy Little Title',
            fields: mockFields,
            model: {}
          }
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatSectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
