import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Workflow, WorkflowSpec, WorkflowTask, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})
export class WorkflowStepsMenuListComponent {
  @Input() task: WorkflowTask;
  @Input() isCurrent: boolean;
  @Output() taskSelected: EventEmitter<WorkflowTask> = new EventEmitter();
  taskStates = WorkflowTaskState;

  constructor() {
  }

  selectTask() {
    this.taskSelected.emit(this.task);
  }
}
