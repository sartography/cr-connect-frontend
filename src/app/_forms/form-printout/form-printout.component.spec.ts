import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup} from '@angular/forms';
import {FormlyConfig, FormlyFieldConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {FormlyMaterialModule} from '@ngx-formly/material';

import { FormPrintoutComponent } from './form-printout.component';

describe('FormPrintoutComponent', () => {
  let component: FormPrintoutComponent;
  let fixture: ComponentFixture<FormPrintoutComponent>;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;
  const mockFields: FormlyFieldConfig[] = [
    {key: 'first_field', type: 'input', templateOptions: {label: 'first field'}},
    {key: 'second_field', type: 'input', templateOptions: {label: 'second field'}},
    {
      key: 'third_field', type: 'multicheckbox', templateOptions: {
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
        FormlyModule.forRoot(),
        FormlyMaterialModule,
      ],
      declarations: [ FormPrintoutComponent ]
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
      fieldGroup: mockFields,
      model: [{
        hi: {
          first_field: '',
          second_field: '',
          third_field: {
            a: true,
            c: true,
          }
        }
      }],
    };
    builder.buildForm(form, [field], [{
      hi: {
        first_field: '',
        second_field: '',
        third_field: {
          a: true,
          c: true,
        }
      }
    }], {});
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(FormPrintoutComponent);
    component = fixture.componentInstance;
    component.field = field;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
