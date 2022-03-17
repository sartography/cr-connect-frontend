import {Component, Input, OnInit} from '@angular/core';
import {Study, WorkflowStatus} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study-progress',
  templateUrl: './study-progress.component.html',
  styleUrls: ['./study-progress.component.scss']
})
export class StudyProgressComponent {
  @Input() study: Study;
  numCompletedWorkflows: number;

  constructor() {
  }
}
