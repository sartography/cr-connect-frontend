import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Study, WorkflowSpecCategory, WorkflowState, WorkflowStatus,} from 'sartography-workflow-lib';
import {WorkflowStats} from 'sartography-workflow-lib/lib/types/stats';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() study: Study;
  categoryTabs: WorkflowSpecCategory[];
  statuses = WorkflowStatus;
  states = WorkflowState;
  selectedCategoryId: number;
  selectedTab: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
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

      if (catIdStr) {
        this.selectCategory(parseInt(catIdStr, 10));
      }
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

  selectCategory(displayOrder) {
    if (this.categoryTabs && this.categoryTabs.length > 0) {
      const cat = this.categoryTabs[displayOrder];
      this.selectedCategoryId = cat.id;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {category: cat.id},
      }).then(() => {
        this.selectedTab = this.categoryTabs.findIndex(c => c.id === cat.id);
      });
    }
  }

  showWorkflowAction(workflowListItem: WorkflowStats) {
    return (
      (workflowListItem.status !== WorkflowStatus.COMPLETE) &&
      (workflowListItem.state !== WorkflowState.DISABLED) &&
      (workflowListItem.state !== WorkflowState.HIDDEN)
    );
  }
}
