import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFormOptions} from '@ngx-formly/core';
import {ApiService, Study, Workflow, WorkflowTask} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})
export class WorkflowFormComponent implements OnInit {
  @Input() study: Study;
  @Input() workflow: Workflow;
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: any = {};

  constructor(private api: ApiService) {
  }

  ngOnInit() {
  }

  saveTaskData(task: WorkflowTask) {
    this.api.updateTaskDataForWorkflow(this.workflow.id, task.name, this.model).subscribe();
  }
}
