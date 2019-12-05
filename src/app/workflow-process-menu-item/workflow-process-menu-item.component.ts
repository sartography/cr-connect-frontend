import {Component, Input, OnInit} from '@angular/core';
import {WorkflowProcess} from '../_models/workflow';

@Component({
  selector: 'app-workflow-process-menu-item',
  templateUrl: './workflow-process-menu-item.component.html',
  styleUrls: ['./workflow-process-menu-item.component.scss']
})
export class WorkflowProcessMenuItemComponent implements OnInit {
  @Input() process: WorkflowProcess;

  constructor() {
  }

  ngOnInit() {
  }

}
