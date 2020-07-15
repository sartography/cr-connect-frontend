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
import {FormGroup} from '@angular/forms';
import createClone from 'rfdc';
import {
  ApiService,
  FileParams,
  MultiInstanceType,
  ToFormlyPipe,
  Workflow,
  WorkflowNavItem,
  WorkflowTask
} from 'sartography-workflow-lib';
import {interval} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {Location} from '@angular/common';

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

  saveTaskData(task: WorkflowTask) {
    return this.api.updateTaskDataForWorkflow(this.workflow.id, task.id, this.model).subscribe(
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

  getMultiInstanceSiblings(task: WorkflowTask): WorkflowNavItem[] {
    if (task.multi_instance_type === MultiInstanceType.NONE) {
      return [];
    } else {
      return this.workflow.navigation.filter(navItem => navItem.task && navItem.task.name === task.name);
    }
  }

  numRemainingSiblingTasks(task: WorkflowTask): number {
    const siblings = this.getMultiInstanceSiblings(task);

    // Get the index of the current task
    const thisIndex = siblings.findIndex(s => s.task_id === task.id);
    return siblings.length - (thisIndex + 1);
  }

  saveAllSiblingTaskData(task: WorkflowTask) {
    const thisModel = createClone()(this.model);
    interval(300)
      .pipe(
        // Loop over remaining siblings
        take(this.numRemainingSiblingTasks(task) + 1),
        map(i => i)
      )
      .subscribe(i => {
        console.log('saving task', i);

        // Populate form field values with the ones from thisModel, but don't overwrite *everything* in this.model
        this.model = createClone()(this.workflow.next_task.data);

        for (const field of this.fields) {
          console.log('field.key', field.key);
          this.model[field.key] = thisModel[field.key];
        }

        console.log('this.workflow.next_task.id', this.workflow.next_task.id);
        this.saveTaskData(this.workflow.next_task);
      });
  }

  goBack() {
    this.location.back();
  }

  private _loadModel(task: WorkflowTask) {
    this.form = new FormGroup({});
    if (task && task.data) {
      this.model = createClone()(task.data);
      this.fileParams = {
        workflow_id: this.workflow.id,
      };
      this.fields = new ToFormlyPipe(this.api).transform(this.task.form.fields, this.fileParams);
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
