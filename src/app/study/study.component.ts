import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Study} from '../_models/study';
import {Workflow} from '../_models/workflow';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  study: Study;
  workflows: Workflow[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    const paramMap = this.route.snapshot.paramMap;
    const studyId = paramMap.get('study_id');
    this.api.getStudy(studyId).subscribe(s => {
      this.study = s;
      this.loadWorkflows();
    });
  }

  ngOnInit() {
  }

  loadWorkflows() {
    this.api.getWorkflowListForStudy(this.study.id).subscribe(sw => {
      this.workflows = sw;
    });
  }

  startWorkflow() {
    this.api.addWorkflowForStudy(this.study.id, 'random_fact').subscribe(() => this.loadWorkflows());
  }
}
