import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Study} from '../_models/study';
import {WorkflowProcess} from '../_models/workflow';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
  study: Study;
  process: WorkflowProcess;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    const paramMap = this.route.snapshot.paramMap;
    const studyId = parseInt(paramMap.get('study_id'), 10);
    const processId = parseInt(paramMap.get('workflow_process_id'), 10);
    this.api.getStudy(studyId).subscribe(s => this.study = s);
    this.api.getWorkflowProcess(processId).subscribe(p => this.process = p);
  }
}
