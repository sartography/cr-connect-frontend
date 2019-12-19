import {Component, Input, OnInit} from '@angular/core';
import {BpmnFormJsonField} from "../_models/json";

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})
export class WorkflowStepsMenuListComponent implements OnInit {
  @Input() form: BpmnFormJsonField;
  @Input() processId: string;
  @Input() categoryId: string;

  constructor() {
  }
3
  ngOnInit() {
  }

  isComplete(form: BpmnFormJsonField) {
    return false;
//    return parseInt(this.categoryId, 10) < 1 && parseInt(step.id, 10) < 1;
  }
}
