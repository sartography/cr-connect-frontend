import {
  AfterContentChecked, AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import {
  ApiService,
  FileParams,
  MultiInstanceType, Study,
  ToFormlyPipe,
  Workflow,
  WorkflowNavItem,
  WorkflowTask,
  WorkflowTaskState,
  PythonService
} from 'sartography-workflow-lib';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { Location } from '@angular/common';
import * as setObjectProperty from 'lodash/set';


@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss'],
})
export class WorkflowFormComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() task: WorkflowTask;
  @Input() workflow: Workflow;
  @Input() study: Study;
  @Input() locked: boolean;
  @Output() workflowUpdated: EventEmitter<Workflow> = new EventEmitter();
  @Output() apiError = new EventEmitter();
  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  formViewState = 'enabled';
  multiInstanceTypes = MultiInstanceType;
  showForm = false;

  @ViewChild('#jsonCode') jsonCodeElement: ElementRef;
  fileParams: FileParams;
  fields: FormlyFieldConfig[];
  activelySaving = false;
  taskStates = WorkflowTaskState;

  constructor(
    private api: ApiService,
    private pythonService: PythonService,
    private location: Location,
    private cdref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._loadModel(this.task);
  }

  ngAfterViewInit() {
    this.cdref.detectChanges()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task && changes.task.currentValue) {
      this._loadModel(changes.task.currentValue);
    }
    this.lockForm();
  }

  /*
  DO NOT Turn this on.  Detecting changes here causes a hell storm of extra calls
  to formly, turning hundreds of calls into thousands for complex forms.
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  */

  saveTaskData(task: WorkflowTask, updateRemaining = false, terminateLoop = false) {
    this.activelySaving = true;
    const modelData = cloneDeep(this.model);

    // Set value of hidden fields to null
    const controls = (this.form as any)._formlyControls;
    if (controls) {
      for (const [key, control] of Object.entries(controls)) {
        if (control instanceof UntypedFormControl) {
          const field = (control as any)._fields[0];
          if (field.hide) {
            setObjectProperty(modelData, key, null);
          }
        }
      }
    }

    // Save task data
    return this.api.updateTaskDataForWorkflow(this.workflow.id, task.id, modelData, updateRemaining, terminateLoop).subscribe(
      updatedWorkflow => {
        this.workflow = updatedWorkflow;
      },
      error => {
        this.apiError.emit(error);
      },
      () => {
        this.activelySaving = false;
        this.workflowUpdated.emit(this.workflow);
      },
    );
  }


  handleKeyUp($event) {
    const thisEl = ($event.target as HTMLElement);

    if (
      thisEl.tagName.toLowerCase() === 'input' &&
      thisEl.hasAttribute('type') &&
      thisEl.getAttribute('type') === 'checkbox' &&
      ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes($event.key)
    ) {
      this._focusNextPrevCheckbox(thisEl, $event.key);
    }
  }

  flattenNavList(navlist: WorkflowNavItem[], startlist): WorkflowNavItem[] {
    // take a nested structure of navigation items and turn it into a list
    // if an item has children then descend into the tree and add all of the
    // children as well.
    for (const task of navlist) {
      startlist.push(task);
      if (task.children.length > 0)
        this.flattenNavList(task.children, startlist);
    }
    return startlist;
  }

  getIncompleteMISiblings(task: WorkflowTask): WorkflowNavItem[] {
    if (task.multi_instance_type === MultiInstanceType.NONE) {
      return [];
    } else {
      const navlist = this.flattenNavList(this.workflow.navigation, []);
      return navlist.filter(navItem => {
        if (navItem.name === null) {
          return false; // some sequence flows may have no name
        }
        const re = /(.+?)(_[0-9]+)*$/;
        const matcha = navItem.name.match(re)[1];
        const matchb = task.name.match(re)[1];
        return (
          matcha === matchb &&
          navItem.state === WorkflowTaskState.READY
        );
      });
    }
  }


  goBack() {
    this.location.back();
  }

  saveDisabled() {
    return (this.locked || this.form.invalid || this.activelySaving);
  }

  private _loadModel(task: WorkflowTask) {
    this.showForm = false;
    // Wait for the python service to be fully loaded, then render the form.
    this.pythonService.ready().subscribe(ready => {
      this.form = new UntypedFormGroup({});
      if (task && task.data && task.form && task.form.fields) {
        this.fileParams = {
          workflow_id: this.workflow.id,
          task_spec_name: task.name,
        };
        /** The formState persists, unless we manually clear it out.  If it persists then
         * we end up getting a polluted form state that has nothing to do with the current
         * form, or that still contains values from a previous form.  */
        this.options.formState = {};
        this.model = cloneDeep(task.data);
        this.fields = new ToFormlyPipe(this.pythonService).transform(task.form.fields, this.fileParams, this.model);
        this.showForm = true;
      }

      if (task && task.state === WorkflowTaskState.READY) {
        this.locked = false;
        this.formViewState = 'enabled';
      } else {
        this.locked = true;
        this.lockForm();
      }
    })
  }

  private _focusNextPrevCheckbox(thisEl: HTMLElement, keyCode: string) {
    const inputEls = this._getInputEls(thisEl);
    const thisIndex = inputEls.findIndex(el => el.id === thisEl.id);
    const prevEl: HTMLElement = inputEls[thisIndex - 1];
    const nextEl: HTMLElement = inputEls[thisIndex + 1];

    if ((keyCode === 'ArrowUp' || keyCode === 'ArrowLeft') && prevEl) {
      this._focusCheckbox(prevEl);
    } else if ((keyCode === 'ArrowDown' || keyCode === 'ArrowRight') && nextEl) {
      this._focusCheckbox(nextEl);
    }
  }

  private _getInputEls(thisEl: HTMLElement): HTMLElement[] {
    const containerElement = this._getAncestorByTagName(thisEl, 'mat-form-field');
    return Array.from(containerElement.getElementsByTagName('input'));
  }

  private _focusCheckbox(checkboxEl: HTMLElement) {
    checkboxEl.focus();
    const matCheckboxElement = this._getAncestorByTagName(checkboxEl, 'mat-checkbox');
    matCheckboxElement.classList.add('cdk-focused', 'cdk-keyboard-focused');
  }

  private _getAncestorByTagName(childElement: HTMLElement, tagName: string): HTMLElement {
    let parentElement = childElement.parentElement;
    while (parentElement.tagName.toLowerCase() !== tagName) {
      parentElement = parentElement.parentElement;
    }
    return parentElement;
  }

  lockForm() {
    if (this.locked) {
      this.formViewState = 'disabled';
      try {
        this.fields.forEach(f => f.templateOptions.disabled = true);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
