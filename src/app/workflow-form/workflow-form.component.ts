import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import createClone from 'rfdc';
import {
  ApiService,
  FileParams,
  MultiInstanceType,
  ToFormlyPipe,
  Workflow,
  WorkflowNavItem,
  WorkflowTask,
  WorkflowTaskState
} from 'sartography-workflow-lib';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {Location} from '@angular/common';
import * as getObjectProperty from 'lodash/get';
import * as setObjectProperty from 'lodash/set';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})
export class WorkflowFormComponent implements OnInit, OnChanges {
  @Input() task: WorkflowTask;
  @Input() workflow: Workflow;
  @Output() workflowUpdated: EventEmitter<Workflow> = new EventEmitter();
  @Output() apiError = new EventEmitter();
  form = new FormGroup({});
  model: any = {};

  @ViewChild('#jsonCode') jsonCodeElement: ElementRef;
  fileParams: FileParams;
  fields: FormlyFieldConfig[];

  constructor(
    private api: ApiService,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this._loadModel(this.task);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task && changes.task.currentValue) {
      this._loadModel(changes.task.currentValue);
    }
  }

  saveTaskData(task: WorkflowTask, updateRemaining = false) {
    const modelData = createClone()(this.model);

    // Set value of hidden fields to null
    const controls = (this.form as any)._formlyControls;
    if (controls) {
      for (const [key, control] of Object.entries(controls)) {
        if (control instanceof FormControl) {
          const field = (control as any)._fields[0];
          if (field.hide) {
            setObjectProperty(modelData, key, null);
          }
        }
      }
    }

    // Save task data
    return this.api.updateTaskDataForWorkflow(this.workflow.id, task.id, modelData).subscribe(
      updatedWorkflow => {
        this.workflow = updatedWorkflow;
      },
      error => {
        this.apiError.emit(error);
      },
      () => {
        if (updateRemaining && this.workflow.next_task) {
          this.saveAllSiblingTaskData(this.workflow.next_task);
        } else {
          this.workflowUpdated.emit(this.workflow);
        }
      }
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

  getIncompleteMISiblings(task: WorkflowTask): WorkflowNavItem[] {
    if (task.multi_instance_type === MultiInstanceType.NONE) {
      return [];
    } else {
      return this.workflow.navigation.filter(navItem => {
        const re = /(.+?)(_[0-9]+)*$/
        const matcha = navItem.name.match(re)[1]
        const matchb = task.name.match(re)[1]
        return (
          matcha === matchb &&
          navItem.state === WorkflowTaskState.READY
        );
      });
    }
  }

  saveAllSiblingTaskData(task: WorkflowTask) {
    const taskModel = createClone()(this.model);

    // Populate form field values with the ones from taskModel, but don't overwrite *everything* in this.model
    this.model = createClone()(this.workflow.next_task.data);

    for (const field of this.fields) {
      const val = getObjectProperty(taskModel, field.key);
      setObjectProperty(this.model, field.key, val);
    }

    this.saveTaskData(task, this.getIncompleteMISiblings(task).length > 1);
  }

  goBack() {
    this.location.back();
  }

  private _loadModel(task: WorkflowTask) {
    this.form = new FormGroup({});
    if (task && task.data && task.form && task.form.fields) {
      this.model = createClone()(task.data);
      this.fileParams = {
        workflow_id: this.workflow.id,
      };
      this.fields = new ToFormlyPipe(this.api).transform(task.form.fields, this.fileParams);
    }
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
}
