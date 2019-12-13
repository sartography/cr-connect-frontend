import {Component, Input, OnInit} from '@angular/core';
import {WorkflowStep} from '../_models/workflow';

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})
export class WorkflowStepsMenuListComponent implements OnInit {
  @Input() steps: WorkflowStep[];
  @Input() processId: string;
  @Input() categoryId: string;

  constructor() { }

  ngOnInit() {
  }

  isComplete(step: WorkflowStep) {
    return parseInt(this.categoryId, 10) < 1 && parseInt(step.id, 10) < 1;
  }
}
