import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, Study, Workflow, WorkflowSpec} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  study: Study;
  workflows: Workflow[] = [];
  workflowSpecs: WorkflowSpec[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    const paramMap = this.route.snapshot.paramMap;
    const studyId = parseInt(paramMap.get('study_id'), 10);
    this.loadWorkflowSpecs();
    this.api.getStudy(studyId).subscribe(s => {
      this.study = s;
      this.loadWorkflows();
    });
  }

  ngOnInit() {
  }

  loadWorkflowSpecs() {
    this.api.getWorkflowSpecList().subscribe(wfs => this.workflowSpecs = wfs);
  }

  loadWorkflows() {
    this.api.getWorkflowListForStudy(this.study.id).subscribe(sw => this.workflows = sw);
  }

  startWorkflow() {
    this.api.addWorkflowForStudy(this.study.id, 'random_fact').subscribe(() => this.loadWorkflows());
  }
}
