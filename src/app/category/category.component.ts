import {Component, Input, OnInit} from '@angular/core';
import {
  ApiService,
  Study, TaskEvent,
  Workflow,
  WorkflowNavItem,
  WorkflowSpecCategory,
  WorkflowStats,
  WorkflowStatus,
  WorkflowTaskState
} from 'sartography-workflow-lib';
import {shouldDisableNavItem, shouldDisplayNavItem, shouldDisplayWorkflow} from '../_util/nav-item';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() category: WorkflowSpecCategory;
  @Input() study: Study;
  @Input() workflowId: number;

  constructor(private api: ApiService) {
  }

  get workflowsToDisplay(): WorkflowStats[] {
    return this.category.workflows.filter(wf => shouldDisplayWorkflow(wf));
  }

  ngOnInit(): void {
  }

  isWorkflowComplete(workflow: WorkflowStats): boolean {
    return workflow.status === WorkflowStatus.COMPLETE;
  }

  getTaskEventForWorkflow(workflowId: number): TaskEvent[] {
    if (this.study && this.study.events && this.study.events.length > 0) {
      return this.study.events.filter(taskEvent => taskEvent.workflow.id === workflowId);
    }
  }

  isTaskComplete(navItem: WorkflowNavItem): boolean {
    return navItem.state === WorkflowTaskState.COMPLETED;
  }

  shouldDisable(navItem: WorkflowNavItem) {
    return shouldDisableNavItem(navItem);
  }
}
