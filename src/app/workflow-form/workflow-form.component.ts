import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import createClone from 'rfdc';
import {ApiService, FileParams, MultiInstanceType, Workflow, WorkflowTask} from 'sartography-workflow-lib';

export interface LoopTask {
  task: WorkflowTask,
  form: FormGroup,
  model: any,
}

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
  loopTasks: LoopTask[];

  @ViewChild('#jsonCode') jsonCodeElement: ElementRef;
  fileParams: FileParams;

  constructor(
    private api: ApiService
  ) {
  }

  ngOnInit() {
    this._loadModel(this.task);

    if (this.task.multi_instance_type === MultiInstanceType.LOOPING.valueOf()) {
      this.loopTasks = this._loadLoopTasks(this.task);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task && changes.task.currentValue) {
      this._loadModel(changes.task.currentValue);

      if (this.task.multi_instance_type === MultiInstanceType.LOOPING.valueOf()) {
        this.loopTasks = this._loadLoopTasks(this.task);
      }
    }
  }

  saveTaskData(task: WorkflowTask) {
    this.api.updateTaskDataForWorkflow(this.workflow.id, task.id, this.model).
    subscribe(
      updatedWorkflow => {
        console.log('saveTaskData workflow', updatedWorkflow);
        this.workflow = updatedWorkflow;
      },
      error => {
        this.apiError.emit(error);
        },
      () => {
        console.log('saveTaskData emitting workflow', this.workflow);
        this.workflowUpdated.emit(this.workflow);
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

  // Generates an array of LoopTask containers (consisting of a copy of the original task,
  // form, and portion of the model) for each _MICurrentVar
  _loadLoopTasks(task: WorkflowTask): LoopTask[] {
    const loops = [];
    if (task && this.model) {
      const numLoops = task.multi_instance_index;
      const dataKey = `${task.name}_MIData`;

      if (!this.model.hasOwnProperty(dataKey)) {
        this.model[dataKey] = {};
      }

      for (let i = 0; i < numLoops; i++) {
        const iKey = `${i}`;

        if (!this.model[dataKey].hasOwnProperty(iKey)) {
          this.model[dataKey][iKey] = {};
        }

        loops.push({
          form: createClone({circles: true})(this.form),
          task: createClone({circles: true})(task),
          model: this.model[dataKey][iKey],
        });
      }
    }

    return loops;
  }

  private _loadModel(task: WorkflowTask) {
    this.form = new FormGroup({});
    if (task && task.data) {
      this.model = createClone()(task.data);
      this.fileParams = {
        workflow_id: this.workflow.id,
      };
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

  hasInvalidForm(loopTasks: LoopTask[]) {
    return loopTasks.some(lt => lt.form.invalid);
  }
}
