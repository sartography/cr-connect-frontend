import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MarkdownModule} from 'ngx-markdown';
import {ToFormlyPipe} from '../../_pipes/to-formly.pipe';
import {mockWorkflowTask0} from 'sartography-workflow-lib';
import {UnescapeLineBreaksPipe} from '../../_pipes/unescape-line-breaks.pipe';

import {MarkdownDescriptionWrapperComponent} from './markdown-description-wrapper.component';

describe('MarkdownDescriptionWrapperComponent', () => {
  let component: MarkdownDescriptionWrapperComponent;
  let fixture: ComponentFixture<MarkdownDescriptionWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MarkdownDescriptionWrapperComponent,
        UnescapeLineBreaksPipe,
      ],
      imports: [
        MarkdownModule.forRoot(),
        MatCardModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(MarkdownDescriptionWrapperComponent);
    component = fixture.componentInstance;
    const pipe = new ToFormlyPipe();
    component.field = pipe.transform(mockWorkflowTask0.form.fields)[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
