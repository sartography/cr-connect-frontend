import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MarkdownModule} from 'ngx-markdown';
import {ToFormlyPipe} from '../../_pipes/to-formly.pipe';
import {mockWorkflowTask0} from 'sartography-workflow-lib';
import {UnescapeLineBreaksPipe} from '../../_pipes/unescape-line-breaks.pipe';

import {HelpWrapperComponent} from './help-wrapper.component';

describe('HelpWrapperComponent', () => {
  let component: HelpWrapperComponent;
  let fixture: ComponentFixture<HelpWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelpWrapperComponent,
        UnescapeLineBreaksPipe,
      ],
      imports: [
        // MarkdownModule,
        MatDialogModule,
        MatIconModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Happy Little Title',
            text: 'Just go out and talk to a tree. Make friends with it. There we go. Only God can make a tree - but you can paint one.'
          }
        }
      ],
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(HelpWrapperComponent);
    component = fixture.componentInstance;
    const pipe = new ToFormlyPipe();
    component.field = pipe.transform(mockWorkflowTask0.form.fields)[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
    const openSpy = spyOn(component.dialog, 'open').and.stub();
    component.openDialog(event, 'this is a title', 'and here is some text');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();
  });
});
