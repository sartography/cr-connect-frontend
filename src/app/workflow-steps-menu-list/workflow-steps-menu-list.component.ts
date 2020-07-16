import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Workflow, WorkflowNavItem, WorkflowTask, WorkflowTaskState, WorkflowTaskType} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})

export class WorkflowStepsMenuListComponent implements OnInit, OnChanges {
  @Input() workflow: Workflow;
  @Input() currentTask: WorkflowTask;
  @Output() taskSelected: EventEmitter<string> = new EventEmitter();
  taskStates = WorkflowTaskState;
  navList: WorkflowNavItem[];
  navListItems: WorkflowNavItem[];
  loading = true;

  constructor() {
  }

  ngOnInit(): void {
    this.loading = true;
    this.navList = this.workflow.navigation;
    this.loadNavListItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    if (changes && changes.workflow && changes.workflow.currentValue) {
      this.loading = true;
      this.navList = changes.workflow.currentValue.navigation;
      this.loadNavListItems();
    }
  }

  selectTask(taskId: string) {
    this.taskSelected.emit(taskId);
  }

  shouldDisplayNavItem(navItem: WorkflowNavItem): boolean {
    const hideTypes = [
      WorkflowTaskType.SCRIPT_TASK,
      WorkflowTaskType.BUSINESS_RULE_TASK,
      WorkflowTaskType.NONE_TASK,
    ];
    return (
      navItem &&
      navItem.task &&
      navItem.task.type &&
      !hideTypes.includes(navItem.task.type)
    );
  }

  loadNavListItems() {
    this.navListItems = this.navList.filter(navItem => this.shouldDisplayNavItem(navItem));
    this.loading = false;
  }

  shouldDisableNavItem(navItem: WorkflowNavItem): boolean {
    return (
      [
        WorkflowTaskState.MAYBE,
        WorkflowTaskState.LIKELY,
        WorkflowTaskState.FUTURE
      ].includes(navItem.state) || !navItem.task_id
    )
  }
}
