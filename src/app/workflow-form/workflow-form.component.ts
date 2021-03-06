import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Inject,
  SimpleChanges,
  ViewChild,
  NgZone
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Location } from '@angular/common';
import * as getObjectProperty from 'lodash/get';
import * as setObjectProperty from 'lodash/set';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss'],
  animations: [
    trigger('disableTrigger', [
      state(
        'default',
        style({
          opacity: 1,
        })
      ),
      state(
        'disabled',
        style({
          opacity: 0.5,
        })
      ),
      transition('* => *', animate('1000ms ease-out')),
    ]),
    trigger('flashTrigger', [
      state('in', style({
        height: '200px',
        opacity: 1,
        color: 'red'
      })),
      transition('* => *', [
        animate('2s', keyframes([
          style({ opacity: 0.1, color: '000000', offset: 0.1 }),
          style({ opacity: 0.3, color: 'red', offset: 0.2 }),
          style({ opacity: 0.7, color: 'red', offset: 0.3 }),
          style({ opacity: 1.0, color: 'red', offset: 0.4 }),
          style({ opacity: 0.3, color: 'red', offset: 0.5 }),
          style({ opacity: 0.5, color: 'red', offset: 0.6 }),
          style({ opacity: 0.7, color: 'red', offset: 0.7 }),
          style({ opacity: 1.0, color: '000000', offset: 0.8 })
        ]))
      ])
    ])
  ]
})
export class WorkflowFormComponent implements OnInit, OnChanges {
  @Input() task: WorkflowTask;
  @Input() workflow: Workflow;
  @Output() workflowUpdated: EventEmitter<Workflow> = new EventEmitter();
  @Output() apiError = new EventEmitter();
  form = new FormGroup({});
  model: any = {};
  formViewState = 'enabled';

  @ViewChild('#jsonCode') jsonCodeElement: ElementRef;
  fileParams: FileParams;
  fields: FormlyFieldConfig[];
  locked = true;
  taskStates = WorkflowTaskState;

  constructor(
    private api: ApiService,
    private location: Location,
    public dialog: MatDialog,
    private ngZone: NgZone) { }

  ngOnInit() {
    this._loadModel(this.task);
    window[`angularComponentReference`] = {
      component: this, zone: this.ngZone, loadAngularFunction: (str: string) => {
        return this.angularFunctionCalled(str);
      }
    };
  }

  angularFunctionCalled(mat: string) {
    console.log(mat);
    this.openDialog(mat);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task && changes.task.currentValue) {
      this._loadModel(changes.task.currentValue);
    }
  }
  openDialog(markdown: string) {
    this.dialog.open(WorkflowFormDialogComponent, {
      data: markdown,
      maxWidth: '600px'
    });
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
      const navlist = this.flattenNavList(this.workflow.navigation, [])
      return navlist.filter(navItem => {
        if (navItem.name === null) // some sequence flows may have no name
          return false;
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

  saveDisabled() {
    console.log('Save Disabled?', (this.form.valid && !this.locked))
    return (this.locked || this.form.invalid)
  }

  private _loadModel(task: WorkflowTask) {
    this.form = new FormGroup({});
    if (task && task.data && task.form && task.form.fields) {
      this.model = createClone()(task.data);
      this.fileParams = {
        workflow_id: this.workflow.id,
        task_spec_name: task.name
      };
      this.fields = new ToFormlyPipe(this.api).transform(task.form.fields, this.fileParams);
    }
    if (task && task.state === WorkflowTaskState.READY) {
      this.locked = false;
      this.formViewState = 'enabled'
    } else {
      this.locked = true;
      this.formViewState = 'disabled'
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

@Component({
  selector: 'app-workflow-form-dialog',
  templateUrl: 'workflow-form-dialog.html',
})

export class WorkflowFormDialogComponent {
  constructor(public dialogRef: MatDialogRef<WorkflowFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {}
  close(){
    this.dialogRef.close();
 }
}
