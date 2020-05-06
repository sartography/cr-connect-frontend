import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WorkflowTask, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})
export class WorkflowStepsMenuListComponent implements OnInit {
  @Input() task: WorkflowTask;
  @Input() isCurrent: boolean;
  @Output() taskSelected: EventEmitter<WorkflowTask> = new EventEmitter();
  taskStates = WorkflowTaskState;

  constructor() {
  }

  ngOnInit(): void {
    console.log('task', this.task);
  }

  selectTask() {
    this.taskSelected.emit(this.task);
  }
}
