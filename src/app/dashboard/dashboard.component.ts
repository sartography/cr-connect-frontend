import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNumberDefined, Study, WorkflowSpecCategory, WorkflowState, WorkflowStatus,} from 'sartography-workflow-lib';
import {WorkflowStats} from 'sartography-workflow-lib/lib/types/stats';
import {shouldDisplayWorkflow} from '../_util/nav-item';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() study: Study;
  @Output() categorySelected = new EventEmitter<number>();
  @Output() workflowSelected = new EventEmitter<number>();
  @Input() selectedCategoryId: number;
  @Input() selectedWorkflowId: number;
  categoryTabs: WorkflowSpecCategory[];
  statuses = WorkflowStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  get selectedCategory(): WorkflowSpecCategory {
    return this.categoryTabs.find(c => c.id === this.selectedCategoryId);
  }

  get isCategorySelected(): boolean {
    return isNumberDefined(this.selectedCategoryId) && !!this.selectedCategory;
  }

  ngOnInit() {
    console.log('this.study.categories', this.study.categories);
    this.categoryTabs = this.study.categories
      .sort((a, b) => (a.display_order < b.display_order) ? -1 : 1)
      .map(cat => {
        cat.workflows = cat.workflows
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

  getStatusLabel(workflow: WorkflowStats) {
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

  getStateLabel(workflow: WorkflowStats) {
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
          this.selectedCategoryId = categoryId;
          this.selectedWorkflowId = workflowId;
          this.categorySelected.emit(this.selectedCategoryId);
        });
      }
    } else if (isNumberDefined(categoryId)) {
      if (this.categoryTabs && this.categoryTabs.length > 0) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {category: categoryId},
        }).then(() => {
          this.selectedCategoryId = categoryId;
          this.categorySelected.emit(this.selectedCategoryId);
        });
      }
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
      }).then(() => {
        this.selectedCategoryId = undefined;
        this.categorySelected.emit(undefined);
      });
    }
  }

  workflowsToShow(workflowListItems: WorkflowStats[]) {
    return workflowListItems.filter(wf => shouldDisplayWorkflow(wf));
  }

  allComplete(cat: WorkflowSpecCategory) {
    return cat.workflows.every(wf => wf.status === WorkflowStatus.COMPLETE);
  }
}
