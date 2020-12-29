import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {NavItemType, TaskEvent, WorkflowNavItem, WorkflowStats, WorkflowStatus} from 'sartography-workflow-lib';

@Component({
  selector: 'app-nav-item-icon',
  templateUrl: './nav-item-icon.component.html',
  styleUrls: ['./nav-item-icon.component.scss']
})
export class NavItemIconComponent implements OnInit, OnChanges {
  @Input() navItem: WorkflowNavItem;
  @Input() taskEvent: TaskEvent;
  @Input() workflowStats: WorkflowStats;

  icon: string;
  css: string;

  constructor() { }

  ngOnInit(): void {
    this.update_icon()
  }

  ngOnChanges(): void {
    this.update_icon()
  }

  update_icon(): void {
    if (this.workflowStats) {
      switch (this.workflowStats.status) {
        case WorkflowStatus.COMPLETE:
          this.icon = 'check_circle';
          this.css = 'complete';
          break;
        case WorkflowStatus.USER_INPUT_REQUIRED:
          this.icon = 'pending';
          break;
        case WorkflowStatus.NOT_STARTED:
          this.icon = 'radio_button_unchecked';
          break;
        case WorkflowStatus.WAITING:
          this.icon = 'remove_circle_outline';
          break;
        default:
          return;
      }
    } else if (this.taskEvent) {
        this.icon = this.iconForState(this.taskEvent.task_state);
    } else if (this.navItem) {
        this.icon = this.iconForNav(this.navItem);
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
