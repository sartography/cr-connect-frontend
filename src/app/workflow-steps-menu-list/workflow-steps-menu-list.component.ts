import {Component, Input, OnInit} from '@angular/core';
import {BpmnFormJsonField} from '../_models/json';
import {WorkflowTask, WorkflowTaskState} from '../_models/workflow-task';

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})
export class WorkflowStepsMenuListComponent implements OnInit {
  @Input() workflowTask: WorkflowTask;

  constructor() {
  }

  ngOnInit() {
  }

  isComplete() {
    return this.workflowTask.state === WorkflowTaskState.COMPLETED;
  }
}
