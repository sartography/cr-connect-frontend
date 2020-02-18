import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyConfig, FormlyFieldConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AppFormlyConfig} from '../../app.module';
import {FormPrintoutComponent} from '../form-printout/form-printout.component';
import {PanelWrapperComponent} from '../panel-wrapper/panel-wrapper.component';
import {RepeatSectionComponent} from './repeat-section.component';

describe('RepeatSectionComponent', () => {
  let component: RepeatSectionComponent;
  let fixture: ComponentFixture<RepeatSectionComponent>;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;
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
        FormlyModule.forRoot({
          types: [
            {name: 'repeat', component: RepeatSectionComponent},
          ],
          wrappers: [
            {name: 'panel', component: PanelWrapperComponent},
          ],
        }),
        FormlyMaterialModule,
        FormsModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FormPrintoutComponent,
        PanelWrapperComponent,
        RepeatSectionComponent,
      ],
      providers: [
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

  beforeEach(inject([FormlyFormBuilder, FormlyConfig], (formlyBuilder: FormlyFormBuilder, formlyConfig: FormlyConfig) => {
    form = new FormGroup({});
    config = formlyConfig;
    builder = formlyBuilder;
    field = {
      key: 'hi',
      defaultValue: 'Hello there.',
      type: 'repeat',
      templateOptions: {label: 'Repeating Section'},
      fieldArray: {
        fieldGroup: mockFields,
      },
      fieldGroup: []
    };
    builder.buildForm(form, [field], {}, {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
