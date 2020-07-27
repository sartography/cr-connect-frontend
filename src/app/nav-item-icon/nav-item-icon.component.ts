import {Component, Input, OnInit} from '@angular/core';
import {TaskEvent, WorkflowNavItem, WorkflowStats, WorkflowStatus, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-nav-item-icon',
  templateUrl: './nav-item-icon.component.html',
  styleUrls: ['./nav-item-icon.component.scss']
})
export class NavItemIconComponent implements OnInit {
  @Input() navItem: WorkflowNavItem;
  @Input() taskEvent: TaskEvent;
  @Input() workflowStats: WorkflowStats

  constructor() { }

  ngOnInit(): void {
  }

  get getIcon(): string {
    if (this.workflowStats) {
      switch (this.workflowStats.status) {
        case WorkflowStatus.COMPLETE:
          return 'check_circle';
        case WorkflowStatus.USER_INPUT_REQUIRED:
          return 'pending';
        case WorkflowStatus.NOT_STARTED:
          return 'radio_button_unchecked';
        case WorkflowStatus.WAITING:
          return 'remove_circle_outline';
        default:
          return 'remove_circle_outline';
      }
    } else if (this.taskEvent) {
      console.log('this.taskEvent.task_state', this.taskEvent.task_state);
      switch (this.taskEvent.task_state) {
        case WorkflowTaskState.COMPLETED:
          return 'check_circle';
        case WorkflowTaskState.WAITING:
          return 'pending';
        case WorkflowTaskState.FUTURE:
          return 'pending';
        case WorkflowTaskState.LIKELY:
          return 'pending';
        case WorkflowTaskState.READY:
          return 'radio_button_unchecked';
        case WorkflowTaskState.LOCKED:
          return 'lock';
        default:
          return 'pending';
      }
    } else if (this.navItem) {
      switch (this.navItem.state) {
        case WorkflowTaskState.COMPLETED:
          return 'check_circle';
        case WorkflowTaskState.WAITING:
          return 'pending';
        case WorkflowTaskState.FUTURE:
          return 'pending';
        case WorkflowTaskState.LIKELY:
          return 'pending';
        case WorkflowTaskState.READY:
          return 'radio_button_unchecked';
        case WorkflowTaskState.LOCKED:
          return 'lock';
        default:
          return 'pending';
      }
    }
  }
}
