import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  ApiService, isNumberDefined,
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
  @Output() workflowUpdated = new EventEmitter<number>();
  selectedWorkflow: Workflow;
  loading = true;
  shouldDisable = shouldDisableNavItem;

  constructor(private api: ApiService) {
  }

  get navItems(): WorkflowNavItem[] {
    if (this.selectedWorkflow && this.selectedWorkflow.navigation && this.selectedWorkflow.navigation.length > 0) {
      return this.selectedWorkflow.navigation.filter(navItem => shouldDisplayNavItem(navItem));
    } else {
      return [];
    }
  }

  get workflowsToDisplay(): WorkflowStats[] {
    if (this.category && this.category.workflows && this.category.workflows.length > 0) {
      return this.category.workflows.filter(wf => shouldDisplayWorkflow(wf));
    } else {
      return [];
    }
  }

  ngOnInit(): void {
    this.loadWorkflow();
  }

  isWorkflowComplete(workflow: WorkflowStats): boolean {
    return workflow.status === WorkflowStatus.COMPLETE;
  }

  isTaskComplete(navItem: WorkflowNavItem): boolean {
    return navItem.state === WorkflowTaskState.COMPLETED;
  }

  selectWorkflow(workflowId: number) {
    this.workflowId = workflowId;
    this.workflowUpdated.emit(workflowId);
    this.loadWorkflow();
  }

  private loadWorkflow() {
    this.loading = true;

    if (isNumberDefined(this.workflowId)) {
     this.api.getWorkflow(this.workflowId, false).subscribe(wf => {
        this.selectedWorkflow = wf;
        this.loading = false;
      });
    }
  }
}
