import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  isNumberDefined,
  Study,
  WorkflowMetadata,
  WorkflowSpecCategory,
  WorkflowState,
  WorkflowStatus,
} from 'sartography-workflow-lib';
import {shouldDisplayWorkflow} from '../_util/nav-item';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  @Input() study: Study;
  @Output() workflowSelected = new EventEmitter<number>();
  @Input() selectedWorkflowId: number;
  categoryTabs: WorkflowSpecCategory[];
  statuses = WorkflowStatus;
  states = WorkflowState;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }


  requiredItem(wf: WorkflowMetadata): boolean{
    return ((wf.state === WorkflowState.REQUIRED)||(wf.state === WorkflowState.DISABLED));
  }

  ngOnInit() {
    console.log('this.study', this.study);
    this.categoryTabs = this.study.categories
      .sort((a, b) => (a.display_order < b.display_order) ? -1 : 1)
      .map(cat => {
        cat.workflows = cat.workflows
      // testing    .map(wf=>this.assignRandomStuff(wf) )
          .filter(wf => wf.state !== WorkflowState.HIDDEN)
          .sort((a, b) => (a.display_order < b.display_order) ? -1 : 1);
        return cat;
      })
      .filter(cat => cat.workflows.length > 0);

    this.route.queryParamMap.subscribe(qParams => {
      const catIdStr = qParams.get('category');
      const wfIdStr = qParams.get('workflow');
      const catId = catIdStr ? parseInt(catIdStr, 10) : undefined;
      const wfId = wfIdStr ? parseInt(wfIdStr, 10) : undefined;
      this.selectCategory(null, catId, wfId);
    });
  }

  workflowLabel(workflow) {
    const stateLabel = this.getStateLabel(workflow);
    const statusLabel = this.getStatusLabel(workflow);

    if (workflow.state === WorkflowState.HIDDEN) {
      return '';
    }

    if (workflow.state === WorkflowState.DISABLED) {
      return 'Not available';
    }

    return `${statusLabel} (${stateLabel})`
  }

  getStatusLabel(workflow: WorkflowMetadata) {
    switch (workflow.status) {
      case WorkflowStatus.NOT_STARTED:
        return 'Not started';
      case WorkflowStatus.USER_INPUT_REQUIRED:
        return `${workflow.completed_tasks} / ${workflow.total_tasks} tasks complete`;
      case WorkflowStatus.COMPLETE:
        return 'Complete';
      case WorkflowStatus.WAITING:
        return 'Waiting...';
      default:
        return;
    }
  }

  getStateLabel(workflow: WorkflowMetadata) {
    switch (workflow.state) {
      case WorkflowState.HIDDEN:
        return '';
      case WorkflowState.OPTIONAL:
        return 'Optional';
      case WorkflowState.REQUIRED:
        return 'Required';
      case WorkflowState.DISABLED:
        return 'Waiting...';
      default:
        return;
    }
  }

  selectCategory($event?: MouseEvent, categoryId?: number, workflowId?: number) {
    if ($event && $event instanceof (MouseEvent)) {
      $event.stopPropagation();
    }

    if (isNumberDefined(categoryId) && isNumberDefined(workflowId)) {
      if (this.categoryTabs && this.categoryTabs.length > 0) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {category: categoryId, workflow: workflowId},
        }).then(() => {
          this.selectedWorkflowId = workflowId;
        });
      }
    } else if (isNumberDefined(categoryId)) {
      if (this.categoryTabs && this.categoryTabs.length > 0) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {category: categoryId},
        }).then(() => {
        });
      }
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
      }).then(() => {
      });
    }
  }

  workflowsToShow(workflowListItems: WorkflowMetadata[]) {
    return workflowListItems.filter(wf => shouldDisplayWorkflow(wf));
  }

  allComplete(cat: WorkflowSpecCategory) {
    return cat.workflows.every(wf => wf.status === WorkflowStatus.COMPLETE);
  }

  selectWorkflow(workflowId: number) {
    this.selectedWorkflowId = workflowId;
    this.workflowSelected.emit(this.selectedWorkflowId);
  }
}
