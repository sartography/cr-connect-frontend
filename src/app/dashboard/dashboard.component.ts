import {Component, Input, OnInit} from '@angular/core';
import {ChartType} from 'chart.js';
import {Color, Label, MultiDataSet} from 'ng2-charts';
import {Study, Workflow, WorkflowSpec} from 'sartography-workflow-lib';

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
        data: [this.randomInts(this.labels.length)],
        type: 'pie',
        colors: this.colors
      };
    });
  }

  randomInts(len: number): number[] {
    let remaining = 100;
    const arr = [];
    for (let i = 0; i < len; i++) {
      const newNum = this.getRandomInt(0, remaining);
      arr.push(newNum);
      remaining -= newNum;
    }

    return arr;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getWorkflowSpecForWorkflow(wf: Workflow): WorkflowSpec {
    return this.workflowSpecs.find(wfs => wfs.id === wf.workflow_spec_id);
  }

}
