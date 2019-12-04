import {Component, Input, OnInit} from '@angular/core';
import {WorkflowStep} from '../_models/workflow';

@Component({
  selector: 'app-workflow-steps-menu-list',
  templateUrl: './workflow-steps-menu-list.component.html',
  styleUrls: ['./workflow-steps-menu-list.component.scss']
})
export class WorkflowStepsMenuListComponent implements OnInit {
  @Input() steps: WorkflowStep[];
  @Input() processId: number;
  @Input() categoryId: number;

  constructor() { }

  ngOnInit() {
  }

  isComplete(step: WorkflowStep) {
    return this.categoryId < 1 && step.id < 1;
  }
}
