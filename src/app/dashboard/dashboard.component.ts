import {Component, Input, OnInit} from '@angular/core';
import {
  Study,
  WorkflowSpecCategory,
} from 'sartography-workflow-lib';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() study: Study;
  categoryTabs: WorkflowSpecCategory[];

  constructor() {
  }

  ngOnInit() {
    this.categoryTabs = this.study.categories
      .sort((a, b) => (a.display_order < b.display_order) ? -1 : 1);
  }
}
