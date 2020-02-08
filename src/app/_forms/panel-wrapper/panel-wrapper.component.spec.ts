import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {ToFormlyPipe} from '../../_pipes/to-formly.pipe';
import {mockWorkflowTask0} from 'sartography-workflow-lib';

import {PanelWrapperComponent} from './panel-wrapper.component';

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
    const pipe = new ToFormlyPipe();
    component.field = pipe.transform(mockWorkflowTask0.form.fields)[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
