import {Component, Input, OnInit} from '@angular/core';
import {
  ApiService,
  Study,
  Workflow,
  WorkflowSpec,
  WorkflowSpecCategory,
  WorkflowTaskState
} from 'sartography-workflow-lib';
import createClone from 'rfdc';

interface WorkflowListItem {
  workflowId: number;
  title: string;
  labels: string[];
  numIncompleteTasks: number;
  numCompleteTasks: number;
  numTotalTasks: number;
  isActive: boolean;
}

interface CategoryTab extends WorkflowSpecCategory {
  workflowListItems: WorkflowListItem[];
}

interface WorkflowStatus {
  name: string;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() study: Study;
  @Input() workflows: Workflow[];
  @Input() workflowSpecs: WorkflowSpec[];
  @Input() workflowSpecCategories: WorkflowSpecCategory[];
  labels = ['Incomplete', 'Partially Complete', 'Complete'];
  categoryTabs: CategoryTab[] = [];


  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.categoryTabs = this.workflowSpecCategories.map(cat => {
      const catTab = createClone()(cat);
      catTab.workflowListItems = [];

      this.workflows.forEach(w => {
        const spec = this.getWorkflowSpecForWorkflow(w);

        if (spec.workflow_spec_category_id === cat.id) {
          this.api.getWorkflowStats(w.id).subscribe(stats => {
            catTab.workflowListItems.push({
              workflowId: w.id,
              title: spec.display_name,
              labels: this.labels,
              numIncompleteTasks: stats.num_tasks_incomplete,
              numCompleteTasks: stats.num_tasks_complete,
              numTotalTasks: stats.num_tasks_total,
              isActive: w.is_active,
            });
          });
        }
      });

      return catTab;
    });
  }

  getWorkflowSpecForWorkflow(wf: Workflow): WorkflowSpec {
    return this.workflowSpecs.find(wfs => wfs.id === wf.workflow_spec_id);
  }

  statusText(card: WorkflowListItem): WorkflowStatus {
    if (card.numCompleteTasks === 0 && card.numIncompleteTasks > 0) {
      return {name: 'not-started', label: 'Not started'};
    } else if (card.numCompleteTasks > 0 && card.numIncompleteTasks > 0) {
      return {name: 'in-progress', label: 'In progress'};
    } else if (card.numIncompleteTasks === 0 && card.numCompleteTasks > 0) {
      return {name: 'complete', label: 'Ready for submission'};
    } else {
      return {name: 'inactive', label: 'Inactive'};
    }
  }
}
