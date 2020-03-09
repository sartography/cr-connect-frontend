import {Component, Input, OnInit} from '@angular/core';
import {Study, Workflow, WorkflowSpec, WorkflowTaskState} from 'sartography-workflow-lib';

interface CardData {
  workflowId: number;
  title: string;
  labels: string[];
  numIncompleteTasks: number;
  numCompleteTasks: number;
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

  constructor() {
  }

  ngOnInit() {
    this.cards = this.workflows.map(w => {
      const spec = this.getWorkflowSpecForWorkflow(w);
      return {
        workflowId: w.id,
        title: spec.display_name,
        labels: this.labels,
        numIncompleteTasks: this.numIncomplete(w),
        numCompleteTasks: this.numComplete(w),
      };
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

  private numIncomplete(w: Workflow): number {
    const incompleteStates = [
      WorkflowTaskState.WAITING,
      WorkflowTaskState.FUTURE,
      WorkflowTaskState.LIKELY,
      WorkflowTaskState.MAYBE,
      WorkflowTaskState.READY,
    ];
    return w.user_tasks.filter(t => incompleteStates.includes(t.state)).length;
  }

  private numComplete(w: Workflow): number {
    const completeStates = [
      WorkflowTaskState.CANCELLED,
      WorkflowTaskState.COMPLETED,
    ];
    return w.user_tasks.filter(t => completeStates.includes(t.state)).length;
  }
}
