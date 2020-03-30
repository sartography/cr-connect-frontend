import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApiService,
  ProtocolBuilderStatus,
  ProtocolBuilderStatusLabels,
  Study,
  Workflow,
  WorkflowSpec, WorkflowSpecCategory
} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  study: Study;
  // workflows: Workflow[] = [];
  // workflowSpecs: WorkflowSpec[];
  // workflowSpecCategories: WorkflowSpecCategory[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    const paramMap = this.route.snapshot.paramMap;
    const studyId = parseInt(paramMap.get('study_id'), 10);
    this.api.getStudy(studyId).subscribe(s => {
      this.study = s;
    });
  }

  ngOnInit() {
  }
  //
  // loadWorkflowSpecs() {
  //   this.api.getWorkflowSpecCategoryList().subscribe(cats => {
  //     this.workflowSpecCategories = cats;
  //     console.log('cats', cats);
  //   });
  //   this.api.getWorkflowSpecList().subscribe(wfs => this.workflowSpecs = wfs);
  // }
  //
  // loadWorkflows() {
  //   this.api
  //     .getWorkflowListForStudy(this.study.id)
  //     .subscribe(sw => {
  //       this.workflows = sw.sort((a, b) => (a.id > b.id) ? 1 : -1);
  //     });
  // }

  startWorkflow() {
    // this.api.addWorkflowForStudy(this.study.id, 'random_fact').subscribe(() => this.loadWorkflows());
  }

  getStatusLabel(status: ProtocolBuilderStatus) {
    return ProtocolBuilderStatusLabels[status.toUpperCase()];
  }

  hasWorkflows() {
    const numWorkflows = this.study.categories.reduce((accumulator, cat) => {
      return accumulator + cat.workflows.length;
    }, 0);
    return numWorkflows > 0;
  }
}
