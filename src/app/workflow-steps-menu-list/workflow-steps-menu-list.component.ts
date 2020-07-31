import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Workflow, WorkflowNavItem, WorkflowTask, WorkflowTaskState, WorkflowTaskType} from 'sartography-workflow-lib';
import {shouldDisableNavItem, shouldDisplayNavItem} from '../_util/nav-item';

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

  loadNavListItems() {
    this.navListItems = this.navList.filter(navItem => shouldDisplayNavItem(navItem));
    this.loading = false;
  }

  shouldDisable(navItem: WorkflowNavItem): boolean {
    return shouldDisableNavItem(navItem);
  }
}
