import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Study} from '../_models/study';
import {Workflow, WorkflowSpec} from '../_models/workflow';
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
  studyWorkflows: Workflow[];
  workflowSpecs: WorkflowSpec[];
  currentWorkflow: Workflow;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    const paramMap = this.route.snapshot.paramMap;
    const studyId = parseInt(paramMap.get('study_id'), 10);
    const workflowId = parseInt(paramMap.get('workflow_id'), 10);
    this.api.getStudy(studyId).subscribe(s => this.study = s);
    this.api.getTaskListForWorkflow(workflowId).subscribe(tasks => this.workflowTasks = tasks);
    this.api.getWorkflowListForStudy(studyId).subscribe(sw => {
      this.studyWorkflows = sw;
      this.currentWorkflow = this.studyWorkflows[0];
    });
    this.api.getWorkflowSpecList().subscribe(wfs => this.workflowSpecs = wfs);
  }

  getWorkflowSpecForWorkflow(wf: Workflow): WorkflowSpec {
    return this.workflowSpecs.find(wfs => wfs.id === wf.workflow_spec_id);
  }
}
