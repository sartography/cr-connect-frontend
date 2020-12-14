import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Workflow, WorkflowNavItem, WorkflowTask, WorkflowTaskState} from 'sartography-workflow-lib';
import {shouldDisableNavItem, shouldDisplayNavItem} from '../_util/nav-item';

@Component({
  selector: 'app-workflow-nav',
  templateUrl: './workflow-nav.component.html',
  styleUrls: ['./workflow-nav.component.scss']
})
export class WorkflowNavComponent implements OnInit {

  @Input() navList: WorkflowNavItem[];
  @Input() currentTask: WorkflowTask;
  @Input() showAll = true;
  @Output() taskSelected: EventEmitter<string> = new EventEmitter();
  taskStates = WorkflowTaskState;
  loading = true;
  expandedMap = new Map();

  constructor() { }

  ngOnInit(): void {
    this.loading = true;
  }

  selectTask(taskId: string) {
    this.taskSelected.emit(taskId);
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
    console.log('EXPANDED', navItem.description, this.expandedMap.get(navItem.spec_id))
    this.expandedMap.set(navItem.spec_id, !(this.expandedMap.get(navItem.spec_id)));
  }

}
