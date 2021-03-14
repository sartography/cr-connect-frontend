import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {SimpleChanges} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {MarkdownModule} from 'ngx-markdown';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockWorkflow0,
  mockWorkflowSpec0,
  mockWorkflowTask0,
  mockWorkflowTask1,
  ToFormlyPipe
} from 'sartography-workflow-lib';
import {WorkflowFormComponent} from './workflow-form.component';
import {MatDialogModule} from '@angular/material/dialog';

describe('WorkflowFormComponent', () => {
  let httpMock: HttpTestingController;
  let component: WorkflowFormComponent;
  let fixture: ComponentFixture<WorkflowFormComponent>;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToFormlyPipe,
        WorkflowFormComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        FormlyMaterialModule,
        FormlyModule.forRoot(),
        HttpClientTestingModule,
        MarkdownModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useValue: mockRouter},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowFormComponent);
    component = fixture.componentInstance;
    const wf = mockWorkflow0;
    wf.workflow_spec = mockWorkflowSpec0;

    component.workflow = wf;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle changes', () => {
    const loadModelSpy = spyOn((component as any), '_loadModel').and.stub();
    const changes: SimpleChanges = {
      task: {
        previousValue: mockWorkflowTask0,
        currentValue: mockWorkflowTask1,
        firstChange: false,
        isFirstChange: (): boolean => false
      }
    };
    component.ngOnChanges(changes);
    expect(loadModelSpy).toHaveBeenCalledWith(mockWorkflowTask1);
  });

  it('should save task data', () => {
    const emitSpy = spyOn(component.workflowUpdated, 'emit').and.stub();
    spyOn((component as any).api, 'updateTaskDataForWorkflow').and.returnValue(of(mockWorkflow0));
    component.saveTaskData(mockWorkflowTask0);
    expect(emitSpy).toHaveBeenCalledWith(mockWorkflow0);
  });

  it('should load task data into Formly model', () => {
    mockWorkflowTask0.data = {bingbong: 'blorpglop'};
    (component as any)._loadModel(mockWorkflowTask0);
    expect(component.model).toEqual({bingbong: 'blorpglop'});
  });

  it('should detect key press on checkbox field', () => {
    const focusSpy = spyOn((component as any), '_focusNextPrevCheckbox').and.stub();

    const checkboxEl = document.createElement('input');
    checkboxEl.setAttribute('type', 'checkbox');

    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(k => {
      component.handleKeyUp({key: k, target: checkboxEl});
      expect(focusSpy).toHaveBeenCalled();
      focusSpy.calls.reset();
    });

    // Ignore keys other than arrow keys
    ['a', 'A', '1', ' '].forEach(k => {
      component.handleKeyUp({key: k, target: checkboxEl});
      expect(focusSpy).not.toHaveBeenCalled();
      focusSpy.calls.reset();
    });

    // Ignore non-checkbox elements
    const textFieldEl = document.createElement('input');
    textFieldEl.setAttribute('type', 'text');

    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(k => {
      component.handleKeyUp({key: k, target: textFieldEl});
      expect(focusSpy).not.toHaveBeenCalled();
      focusSpy.calls.reset();
    });
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

  it('should get list of sibling input elements of the given input element', () => {
    const grandParentEl: HTMLElement = document.createElement('mat-form-field');
    const parentEls: HTMLElement[] = ['parent_a', 'parent_b', 'parent_c'].map(id => {
      const el = document.createElement('div');
      el.setAttribute('id', id);
      return el;
    });

    const inputEls: HTMLElement[] = ['a', 'b', 'c'].map(id => {
      const el = document.createElement('input');
      el.setAttribute('type', 'checkbox');
      el.setAttribute('id', id);
      return el;
    });

    // Assemble the ancestor hierarchy
    inputEls.forEach((el, i) => parentEls[i].appendChild(el));
    parentEls.forEach(el => grandParentEl.appendChild(el));

    expect((component as any)._getInputEls(inputEls[0])).toEqual(inputEls);
  });

  it('should set focus on given checkbox', () => {
    const grandParentEl: HTMLElement = document.createElement('mat-checkbox');
    const parentEl = document.createElement('div');
    const el = document.createElement('input');
    el.setAttribute('type', 'checkbox');
    el.setAttribute('id', 'checkMe');
    parentEl.appendChild(el);
    grandParentEl.appendChild(parentEl);

    (component as any)._focusCheckbox(el);
    expect(grandParentEl.classList.contains('cdk-focused')).toEqual(true);
    expect(grandParentEl.classList.contains('cdk-keyboard-focused')).toEqual(true);
  });

});
