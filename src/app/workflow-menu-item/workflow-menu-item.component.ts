import {Component, Input} from '@angular/core';
import {Study} from '../_models/study';
import {Workflow, WorkflowSpec} from '../_models/workflow';
import {WorkflowTask} from '../_models/workflow-task';

@Component({
  selector: 'app-workflow-menu-item',
  templateUrl: './workflow-menu-item.component.html',
  styleUrls: ['./workflow-menu-item.component.scss']
})
export class WorkflowMenuItemComponent {
  @Input() study: Study;
  @Input() studyWorkflows: Workflow[];

  constructor() {
  }
}
