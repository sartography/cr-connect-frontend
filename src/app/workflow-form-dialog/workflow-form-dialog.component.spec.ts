import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFormDialogComponent } from './workflow-form-dialog.component';

describe('WorkflowFormDialogComponent', () => {
  let component: WorkflowFormDialogComponent;
  let fixture: ComponentFixture<WorkflowFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should autofocus on the OK button', () => {
    const input = fixture.nativeElement.querySelector('#ok-button:focus');
    
    expect(input).toBeTruthy();
  });
  it('should focus on next or previous checkbox', () => {
    const inputEls = ['a', 'b', 'c'].map(id => {
      const el = document.createElement('input');
      el.setAttribute('type', 'checkbox');
      el.setAttribute('id', id);
      return el;
    });
    const getInputElsSpy = spyOn((component as any), '_getInputEls').and.returnValue(inputEls);
    const focusCheckboxSpy = spyOn((component as any), '_focusCheckbox').and.stub();

    inputEls.forEach((el, elIndex) => {
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(keyPressed => {
        (component as any)._focusNextPrevCheckbox(el, keyPressed);
        expect(getInputElsSpy).toHaveBeenCalled();
        getInputElsSpy.calls.reset();

        if (
          ((elIndex === 0) && ['ArrowUp', 'ArrowLeft'].includes(keyPressed)) ||                      // First one
          ((elIndex === (inputEls.length - 1)) && ['ArrowDown', 'ArrowRight'].includes(keyPressed))  // Last one
        ) {
          expect(focusCheckboxSpy).not.toHaveBeenCalled();
        } else {
          expect(focusCheckboxSpy).toHaveBeenCalled();
        }

        focusCheckboxSpy.calls.reset();
      });
    });
  });
});
