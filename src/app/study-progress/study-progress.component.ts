import {Component, Input, OnInit} from '@angular/core';
import {Study, WorkflowStatus} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study-progress',
  templateUrl: './study-progress.component.html',
  styleUrls: ['./study-progress.component.scss']
})
export class StudyProgressComponent implements OnInit {
  @Input() study: Study;
  numCompletedWorkflows: number;
  numTotalWorkflows: number;
  percentComplete: number;

  constructor() {
  }

  ngOnInit() {
    this.calculatePercentComplete();
  }

  calculatePercentComplete() {
    this.numCompletedWorkflows = 0;
    this.numTotalWorkflows = 0;
    this.percentComplete = 0;
    this.study.categories.forEach(cat => {
      cat.workflows.forEach(wf => {
        if (wf.status === WorkflowStatus.COMPLETE) {
          this.numCompletedWorkflows += 1;
        }
        this.numTotalWorkflows += 1;
      });
    });

    if (this.numCompletedWorkflows > 0) {
      this.percentComplete = Math.floor(this.numCompletedWorkflows / this.numTotalWorkflows * 100);
    }
  }
}
