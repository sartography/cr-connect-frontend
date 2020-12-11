import {Component, Input, OnInit} from '@angular/core';
import {NavItemType, TaskEvent, WorkflowNavItem, WorkflowStats, WorkflowStatus} from 'sartography-workflow-lib';

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

  get icon(): string {
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
          return;
      }
    } else if (this.taskEvent) {
      return this.iconForState(this.taskEvent.task_state);
    } else if (this.navItem) {
      return this.iconForNav(this.navItem);
    }
  }

  private iconForNav(nav: WorkflowNavItem) {
    switch (nav.spec_type) {
      case NavItemType.USER_TASK:
        return this.iconForState(nav.state);
      case NavItemType.EXCLUSIVE_GATEWAY:
        return 'alt_route';
      case NavItemType.SEQUENCE_FLOW:
        return 'arrow_right';
    }
  }

  private iconForState(taskState: string) {
    const stateIcons = {
      future: 'pending',
      waiting: 'remove_circle_outline',
      ready: 'radio_button_unchecked',
      cancelled: 'remove_circle_outline',
      completed: 'check_circle',
      likely: 'pending',
      maybe: 'pending',
      locked: 'lock',
      noop: 'remove_circle_outline',
      none: 'remove_circle_outline',
    };
    if(taskState != null) {
      return stateIcons[taskState.toLowerCase()];
    } else {
      return stateIcons.noop;
    }
  }
}
