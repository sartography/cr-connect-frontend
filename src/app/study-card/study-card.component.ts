import {Component, Input, OnInit} from '@angular/core';
import {ApiService, Study, Workflow, WorkflowTaskState} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study-card',
  templateUrl: './study-card.component.html',
  styleUrls: ['./study-card.component.scss']
})
export class StudyCardComponent implements OnInit {
  @Input() study: Study;
  @Input() isNew: boolean;
  workflows: Workflow[];
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
    let numTasks = 0;
    let numDone = 0;
    const doneStates = [
      WorkflowTaskState.COMPLETED,
      WorkflowTaskState.CANCELLED,
    ];

    this.workflows.forEach(wf => {
      numTasks += wf.user_tasks.length;
      numDone += wf.user_tasks.filter(t => doneStates.includes(t.state)).length;
    });

    if (numTasks > 0) {
      this.percentComplete = Math.floor(numDone / numTasks * 100);
    }
  }
}
