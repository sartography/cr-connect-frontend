import {Component, Input} from '@angular/core';
import {Study, Workflow} from 'sartography-workflow-lib';

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
