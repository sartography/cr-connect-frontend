import {Component, Input, OnInit} from '@angular/core';
import {ChartType} from 'chart.js';
import {Color, Label, MultiDataSet} from 'ng2-charts';
import {Study, Workflow, WorkflowSpec, WorkflowTaskState} from 'sartography-workflow-lib';

interface ChartData {
  workflowId: number;
  title: string;
  labels: Label[];
  data: MultiDataSet;
  type: ChartType;
  colors: Color[];
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
  colors: Color[] = [{
    backgroundColor: [
      '#E57200', // orange
      '#5266a5', // light blue
      '#232D4B', // dark blue
    ]
  }];
  labels: Label[] = ['Incomplete', 'Partially Complete', 'Complete'];
  charts: ChartData[] = [];

  constructor() {
  }

  ngOnInit() {
    this.charts = this.workflows.map(w => {
      const spec = this.getWorkflowSpecForWorkflow(w);
      return {
        workflowId: w.id,
        title: spec.display_name,
        labels: this.labels,
        data: [[
          this.numIncomplete(w),
          this.numPartial(w),
          this.numComplete(w),
        ]],
        type: 'pie',
        colors: this.colors
      };
    });
  }

  getWorkflowSpecForWorkflow(wf: Workflow): WorkflowSpec {
    return this.workflowSpecs.find(wfs => wfs.id === wf.workflow_spec_id);
  }

  private numIncomplete(w: Workflow): number {
    const incompleteStates = [
      WorkflowTaskState.WAITING,
      WorkflowTaskState.FUTURE,
      WorkflowTaskState.LIKELY,
      WorkflowTaskState.MAYBE,
    ];
    return w.user_tasks.filter(t => incompleteStates.includes(t.state)).length;
  }

  private numPartial(w: Workflow): number {
    return w.user_tasks.filter(t => WorkflowTaskState.READY === t.state).length;
  }

  private numComplete(w: Workflow): number {
    const completeStates = [
      WorkflowTaskState.CANCELLED,
      WorkflowTaskState.COMPLETED,
    ];
    return w.user_tasks.filter(t => completeStates.includes(t.state)).length;
  }

}
