import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFormOptions} from '@ngx-formly/core';
import {ApiService, Study, Workflow, WorkflowTask} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})
export class WorkflowFormComponent implements OnInit {
  @Input() task: WorkflowTask;
  @Input() workflow: Workflow;
  @Output() workflowUpdated: EventEmitter<Workflow> = new EventEmitter();
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: any = {};

  constructor(private api: ApiService) {
  }

  ngOnInit() {
  }

  saveTaskData(task: WorkflowTask) {
    this.api.updateTaskDataForWorkflow(this.workflow.id, task.id, this.model).subscribe(
      updatedWorkflow => {
        this.workflowUpdated.emit(updatedWorkflow);
      }
    );
  }
}
