import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NavItemType, WorkflowNavItem, WorkflowTask, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-progress-menu',
  templateUrl: './workflow-progress-menu.component.html',
  styleUrls: ['./workflow-progress-menu.component.scss']
})
export class WorkflowProgressMenuComponent implements OnInit, OnChanges {

  @Input() navList: WorkflowNavItem[];
  @Input() currentTask: WorkflowTask;
  @Output() taskSelected: EventEmitter<string> = new EventEmitter();

  completedTasks:  WorkflowNavItem[];
  readyTasks:  WorkflowNavItem[];
  futureTasks: WorkflowNavItem[];

  constructor() { }

  ngOnInit(): void {
    this.updateList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateList();
  }

  updateList() {
    this.completedTasks = this.userTasksByState(this.navList, [WorkflowTaskState.COMPLETED]);
    this.readyTasks = this.userTasksByState(this.navList, [WorkflowTaskState.READY]);
    this.futureTasks = this.userTasksByState(this.navList, [WorkflowTaskState.FUTURE,
      WorkflowTaskState.MAYBE, WorkflowTaskState.LIKELY, WorkflowTaskState.WAITING]);
  }

  userTasksByState(tasks: WorkflowNavItem[], states: WorkflowTaskState[], results: WorkflowNavItem[] = []) {
    /** recurses through a deep nav to find all nav items
     *  regardless of depth, that are user or manual tasks.
     */
    if(tasks) {
      for(const t of tasks) {
        if (states.includes(t.state) &&
          (t.spec_type as NavItemType === NavItemType.USER_TASK ||
            t.spec_type as NavItemType === NavItemType.MANUAL_TASK)) {
          results.push(t);
        }
        this.userTasksByState(t.children, states, results);
      }
    }
    return results
  }

  selectTask(navItem: WorkflowNavItem) {
    if (this.selectable(navItem)) {
      this.taskSelected.emit(navItem.task_id);
    }
  }

  selectable(navItem: WorkflowNavItem) {
    let isCurrent = false;
    if(this.currentTask !== undefined && this.currentTask !== null && this.currentTask.id === navItem.task_id) {
      isCurrent = true;
    }
    return (navItem.state === WorkflowTaskState.READY ||
      navItem.state === WorkflowTaskState.COMPLETED) &&
      !isCurrent;
  }

}
