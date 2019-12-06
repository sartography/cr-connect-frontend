import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {workflowProcesses} from '../_services/api/api.service.spec';

import { PanelWrapperComponent } from './panel-wrapper.component';

describe('PanelWrapperComponent', () => {
  let component: PanelWrapperComponent;
  let fixture: ComponentFixture<PanelWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PanelWrapperComponent
      ],
      imports: [
        MatCardModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(PanelWrapperComponent);
    component = fixture.componentInstance;
    component.field = workflowProcesses[0].categories[0].steps[0].form.fields[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
