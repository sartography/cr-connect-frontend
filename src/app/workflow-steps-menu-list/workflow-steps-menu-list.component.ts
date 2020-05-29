import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WorkflowNavItem, WorkflowTask, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})

export class WorkflowStepsMenuListComponent implements OnInit {
  @Input() navList: WorkflowNavItem[];
  @Input() currentTask: WorkflowTask;
  @Output() taskSelected: EventEmitter<string> = new EventEmitter();
  taskStates = WorkflowTaskState;

  constructor() {
  }

  ngOnInit(): void {
    console.log('navList', this.navList);
    console.log('currentTask', this.currentTask);
  }

  selectTask(taskId: string) {
    this.taskSelected.emit(taskId);
  }
}
