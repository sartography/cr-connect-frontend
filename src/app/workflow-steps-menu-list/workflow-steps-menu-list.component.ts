import {Component, Input, OnInit} from '@angular/core';
import {WorkflowSpec, WorkflowTask, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})
export class WorkflowStepsMenuListComponent implements OnInit {
  @Input() workflowTask: WorkflowTask;
  @Input() workflowSpecs: WorkflowSpec[];

  constructor() {
  }

  ngOnInit() {
  }

  isComplete() {
    return this.workflowTask.state === WorkflowTaskState.COMPLETED;
  }
}
