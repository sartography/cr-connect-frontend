import {Component, Input, OnInit} from '@angular/core';
import {
  ApiService, Study,
  Workflow,
  WorkflowNavItem,
  WorkflowSpecCategory,
  WorkflowStats,
  WorkflowStatus,
  WorkflowTaskState
} from 'sartography-workflow-lib';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() category: WorkflowSpecCategory;
  @Input() study: Study;
  workflows: Workflow[] = [];

  constructor(private api: ApiService) {
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
        return workflow.navigation;
      }
    }
  }

  isTaskComplete(navItem: WorkflowNavItem): boolean {
    return navItem.state === WorkflowTaskState.COMPLETED;
  }
}
