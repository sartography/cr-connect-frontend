import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  NavItemType,
  WorkflowNavItem,
  WorkflowTask,
  WorkflowTaskState,
  WorkflowTaskType
} from 'sartography-workflow-lib';
import {shouldDisableNavItem, shouldDisplayNavItem} from '../_util/nav-item';

@Component({
  selector: 'app-workflow-nav',
  templateUrl: './workflow-nav.component.html',
  styleUrls: ['./workflow-nav.component.scss']
})
export class WorkflowNavComponent implements OnInit {
  /*
  This is a recursive component that will render a list of nav items,
  Then re-call itself to display all that nav-items children, through
  an unlimited depth.  It is a particularly good experience for end users
  but can be helpful when debugging.
   */
  @Input() navList: WorkflowNavItem[];
  @Input() currentTask: WorkflowTask;
  @Input() showAll = true;
  @Output() taskSelected: EventEmitter<string> = new EventEmitter();
  taskStates = WorkflowTaskState;
  loading = true;
  expandedMap = new Map();

  completedTasks:  WorkflowNavItem[];
  readyTasks:  WorkflowNavItem[];
  futureTasks: WorkflowNavItem[];

  constructor() { }

  ngOnInit(): void {
    this.loading = true;
  }

  shouldDisable(navItem: WorkflowNavItem): boolean {
    return shouldDisableNavItem(navItem);
  }

  shouldDisplay(navItem: WorkflowNavItem): boolean {
    return this.showAll || shouldDisplayNavItem(navItem);
  }

  isExpanded(navItem: WorkflowNavItem): boolean {
    if(!this.expandedMap.has(navItem.spec_id)) {
      if(navItem.state === WorkflowTaskState.READY) {
        this.expandedMap.set(navItem.spec_id, true)
      } else {
        this.expandedMap.set(navItem.spec_id, false)
      }
    }
    return this.expandedMap.get(navItem.spec_id)
  }

  toggleExpanded(navItem: WorkflowNavItem) {
    console.log('EXPANDED', navItem.description, this.expandedMap.get(navItem.spec_id));
    this.expandedMap.set(navItem.spec_id, !(this.expandedMap.get(navItem.spec_id)));
  }

  selectTask(taskId: string) {
    this.taskSelected.emit(taskId);
  }
}
