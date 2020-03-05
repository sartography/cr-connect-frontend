import {Component, Input, OnInit} from '@angular/core';
import {ApiService, Study, Workflow, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study-progress',
  templateUrl: './study-progress.component.html',
  styleUrls: ['./study-progress.component.scss']
})
export class StudyProgressComponent implements OnInit {
  @Input() study: Study;
  workflows: Workflow[];
  numTasksComplete = 0;
  numTasksTotal = 0;
  percentComplete = 0;

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.getWorkflowListForStudy(this.study.id).subscribe(wfs => {
      this.workflows = wfs;
      this.calculatePercentComplete();
    });
  }

  calculatePercentComplete() {
    this.numTasksTotal = 0;
    this.numTasksComplete = 0;

    const doneStates = [
      WorkflowTaskState.COMPLETED,
      WorkflowTaskState.CANCELLED,
    ];

    this.workflows.forEach(wf => {
      this.numTasksTotal += wf.user_tasks.length;
      this.numTasksComplete += wf.user_tasks.filter(t => doneStates.includes(t.state)).length;
    });

    if (this.numTasksTotal > 0) {
      this.percentComplete = Math.floor(this.numTasksComplete / this.numTasksTotal * 100);
    }
  }

}
