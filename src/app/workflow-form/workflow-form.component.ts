import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFormOptions} from '@ngx-formly/core';
import createClone from 'rfdc';
import {ApiService, Workflow, WorkflowTask} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})
export class WorkflowFormComponent implements OnInit, OnChanges {
  @Input() task: WorkflowTask;
  @Input() workflow: Workflow;
  @Output() workflowUpdated: EventEmitter<Workflow> = new EventEmitter();
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: any = {};
  loading = true;

  constructor(
    private api: ApiService
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
    this.api.updateTaskDataForWorkflow(this.workflow.id, task.id, this.model).subscribe(
      updatedWorkflow => {
        this.workflowUpdated.emit(updatedWorkflow);
      }
    );
  }

  private _loadModel(task: WorkflowTask) {
    if (task && task.data) {
      this.model = createClone()(task.data);
    }
  }
}
