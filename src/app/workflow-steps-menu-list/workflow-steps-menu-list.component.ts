import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WorkflowNavItem, WorkflowTask, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})

export class WorkflowStepsMenuListComponent implements OnInit {
  @Input() navList: WorkflowNavItem[];
  @Output() taskSelected: EventEmitter<string> = new EventEmitter();
  taskStates = WorkflowTaskState;

  constructor() {
  }

  ngOnInit(): void {
    console.log('navList', this.navList);
  }

  selectTask(taskId: string) {
    this.taskSelected.emit(taskId);
  }
}
