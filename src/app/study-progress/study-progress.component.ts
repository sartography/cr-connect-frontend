import {Component, Input, OnInit} from '@angular/core';
import {ApiService, Study, Workflow, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study-progress',
  templateUrl: './study-progress.component.html',
  styleUrls: ['./study-progress.component.scss']
})
export class StudyProgressComponent implements OnInit {
  @Input() study: Study;
  numCompletedTasks: number;
  numTotalTasks: number;
  percentComplete: number;

  constructor() {
  }

  ngOnInit() {
    this.calculatePercentComplete();
  }

  calculatePercentComplete() {
    this.numCompletedTasks = 0;
    this.numTotalTasks = 0;
    this.percentComplete = 0;
    this.study.categories.forEach(cat => {
      cat.workflows.forEach(wf => {
        if (wf.completed_tasks > 0) {
          this.numCompletedTasks += wf.completed_tasks;
        }

        if (wf.total_tasks > 0) {
          this.numTotalTasks += wf.total_tasks;
        }
      });
    });

    if (this.numCompletedTasks > 0) {
      this.percentComplete = Math.floor(this.numCompletedTasks / this.numTotalTasks * 100);
    }
  }

}
