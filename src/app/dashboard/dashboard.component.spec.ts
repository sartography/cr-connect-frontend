import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {RouterTestingModule} from '@angular/router/testing';
import {ChartsModule} from 'ng2-charts';
import {mockStudies} from '../_testing/mocks/study.mocks';
import {mockWorkflowSpecs} from '../_testing/mocks/workflow-spec.mocks';
import {mockWorkflows} from '../_testing/mocks/workflow.mocks';

import {DashboardComponent} from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        MatIconModule,
        RouterTestingModule,
        ChartsModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.study = mockStudies[0];
    component.workflows = mockWorkflows;
    component.workflowSpecs = mockWorkflowSpecs;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
