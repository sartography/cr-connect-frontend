import {Component, Input, OnInit} from '@angular/core';
import {
  ApiService,
  Study,
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
  workflows: Workflow[] = [];

  constructor(private api: ApiService) {
  }

  get workflowsToDisplay(): WorkflowStats[] {
    return this.category.workflows.filter(wf => shouldDisplayWorkflow(wf));
  }

  ngOnInit(): void {
    this.category.workflows.forEach(wf => {
      this.api.getWorkflow(wf.id).subscribe(w => this.workflows.push(w));
    });
  }

  isWorkflowComplete(workflow: WorkflowStats): boolean {
    return workflow.status === WorkflowStatus.COMPLETE;
  }

  getNavForWorkflow(workflowId: number): WorkflowNavItem[] {
    if (this.workflows && this.workflows.length > 0) {
      const workflow = this.workflows.find(wf => wf.id === workflowId);
      if (workflow && workflow.navigation) {
        return workflow.navigation.filter(navItem => shouldDisplayNavItem(navItem));
      }
    }
  }

  isTaskComplete(navItem: WorkflowNavItem): boolean {
    return navItem.state === WorkflowTaskState.COMPLETED;
  }

  shouldDisable(navItem: WorkflowNavItem) {
    return shouldDisableNavItem(navItem);
  }
}
