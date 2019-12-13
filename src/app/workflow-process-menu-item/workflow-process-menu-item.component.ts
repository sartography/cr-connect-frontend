import {Component, Input, OnInit} from '@angular/core';
import {Study} from '../_models/study';
import {WorkflowProcess} from '../_models/workflow';

@Component({
  selector: 'app-workflow-process-menu-item',
  templateUrl: './workflow-process-menu-item.component.html',
  styleUrls: ['./workflow-process-menu-item.component.scss']
})
export class WorkflowProcessMenuItemComponent {
  @Input() study: Study;
  @Input() process: WorkflowProcess;

  constructor() {
  }
}
