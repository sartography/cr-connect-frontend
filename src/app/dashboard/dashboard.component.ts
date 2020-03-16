import {Component, Input, OnInit} from '@angular/core';
import {ApiService, Study, Workflow, WorkflowSpec, WorkflowTaskState} from 'sartography-workflow-lib';

interface CardData {
  workflowId: number;
  title: string;
  labels: string[];
  numIncompleteTasks: number;
  numCompleteTasks: number;
  numTotalTasks: number;
  isActive: boolean;
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
  labels = ['Incomplete', 'Partially Complete', 'Complete'];
  cards: CardData[] = [];

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    console.log('this.workflows', this.workflows);
    this.workflows.forEach(w => {
      const spec = this.getWorkflowSpecForWorkflow(w);
      this.api.getWorkflowStats(w.id).subscribe(stats => {
        this.cards.push({
          workflowId: w.id,
          title: spec.display_name,
          labels: this.labels,
          numIncompleteTasks: stats.num_tasks_incomplete,
          numCompleteTasks: stats.num_tasks_complete,
          numTotalTasks: stats.num_tasks_total,
          isActive: w.is_active,
        });
      });
    });
  }

  getWorkflowSpecForWorkflow(wf: Workflow): WorkflowSpec {
    return this.workflowSpecs.find(wfs => wfs.id === wf.workflow_spec_id);
  }

  statusText(card: CardData): WorkflowStatus {
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
