import {Component, Input, OnInit} from '@angular/core';
import {Study} from '../_models/study';
import {WorkflowTask} from '../_models/workflow-task';

@Component({
  selector: 'app-workflow-menu-item',
  templateUrl: './workflow-menu-item.component.html',
  styleUrls: ['./workflow-menu-item.component.scss']
})
export class WorkflowMenuItemComponent implements OnInit {
  @Input() study: Study;
  @Input() workflowTasks: WorkflowTask[];

  constructor() {
  }

  ngOnInit(): void {
    console.log('this.workflowTasks', this.workflowTasks);
  }
}
