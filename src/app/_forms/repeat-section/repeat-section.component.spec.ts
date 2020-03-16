import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FieldArrayType, FormlyConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {DeviceDetectorService} from 'ngx-device-detector';
import createClone from 'rfdc';
import {of} from 'rxjs';
import {mockFormlyFieldConfig} from '../../_mocks/form/mockForm';
import {FormPrintoutComponent} from '../form-printout/form-printout.component';
import {PanelWrapperComponent} from '../panel-wrapper/panel-wrapper.component';
import {RepeatSectionDialogComponent} from '../repeat-section-dialog/repeat-section-dialog.component';
import {RepeatSectionComponent} from './repeat-section.component';

describe('RepeatSectionComponent', () => {
  let component: RepeatSectionComponent;
  let fixture: ComponentFixture<RepeatSectionComponent>;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;
  const mockData = {
    field_key: {
      first_field: 'First Field Value',
      second_field: 'Second Field Value',
      third_field: {a: true},
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormlyModule.forRoot({
          types: [
            {name: 'repeat', component: RepeatSectionComponent},
          ],
          wrappers: [
            {name: 'panel', component: PanelWrapperComponent},
          ],
        }),
        FormlyMaterialModule,
        FormlyMatDatepickerModule,
        FormsModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FormPrintoutComponent,
        PanelWrapperComponent,
        RepeatSectionComponent,
        RepeatSectionDialogComponent,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            },
            afterClosed: (dialogResult: any) => of(mockData),
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: []
        },
        DeviceDetectorService,
      ],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          RepeatSectionDialogComponent
        ]
      }
    })
      .compileComponents();
  }));

  beforeEach(inject([FormlyFormBuilder, FormlyConfig], (formlyBuilder: FormlyFormBuilder, formlyConfig: FormlyConfig) => {
    form = new FormGroup({});
    config = formlyConfig;
    builder = formlyBuilder;
    field = {
      key: 'field_key',
      type: 'repeat',
      templateOptions: {label: 'Repeating Section'},
      fieldArray: {
        fieldGroup: mockFormlyFieldConfig.fieldGroup,
      },
    };
    builder.buildForm(form, [field], [mockData], {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatSectionComponent);
    component = fixture.componentInstance;
    component.field = field;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    const addSpy = spyOn(FieldArrayType.prototype, 'add').and.stub();
    // @ts-ignore
    const openDialogSpy = spyOn(component.dialog, 'open').and.returnValue({afterClosed: () => of(mockData)});

    component.openDialog(0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
  });
});