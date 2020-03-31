import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, ProtocolBuilderStatus, ProtocolBuilderStatusLabels, Study} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  study: Study;

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
