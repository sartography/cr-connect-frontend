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
  categoryTabs: WorkflowSpecCategory[];

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.categoryTabs = this.study.categories
      .sort((a, b) => (a.display_order < b.display_order) ? -1 : 1);
  }
}
