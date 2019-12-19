import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Study} from '../_models/study';
import {WorkflowTask} from '../_models/workflow-task';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
  study: Study;
  workflowTasks: WorkflowTask[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    const paramMap = this.route.snapshot.paramMap;
    const studyId = paramMap.get('study_id');
    const workflowId = paramMap.get('workflow_id');
    this.api.getStudy(studyId).subscribe(s => this.study = s);
    this.api.getTaskListForWorkflow(workflowId).subscribe(tasks => {
      this.workflowTasks = tasks;
    });
  }
}
