import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {workflowProcesses} from '../_services/api/api.service.spec';

import {WorkflowProcessComponent} from './workflow-process.component';

describe('WorkflowProcessComponent', () => {
  let component: WorkflowProcessComponent;
  let fixture: ComponentFixture<WorkflowProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowProcessComponent],
      imports: [
        BrowserAnimationsModule,
        FormlyMaterialModule,
        FormlyModule.forRoot(),
        NoopAnimationsModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowProcessComponent);
    component = fixture.componentInstance;
    component.process = workflowProcesses[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
