import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {shrink} from '../_util/shrink'
import {
  ApiService,
  isNumberDefined,
  StudyStatus,
  StudyStatusLabels,
  Study,
  Workflow, StudyAssociate
} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  study: Study;
  allWorkflows: Workflow[] = [];
  loading = true;
  selectedWorkflowId: number;
  associates: StudyAssociate[];
  PI: StudyAssociate;
  shrink = shrink;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
  }


  get isWorkflowSelected(): boolean {
    return isNumberDefined(this.selectedWorkflowId);
  }

  ngOnInit() {
    console.log('Init Called');
    this.loadStudy();
  }

  loadStudy() {
    console.log('Loading Study ...');
    this.route.paramMap.subscribe(paramMap => {
      const studyId = parseInt(paramMap.get('study_id'), 10);
      // On this rare occasion, we want to force a status check on all the workflows.
      this.api.getStudy(studyId, true).subscribe(s => {
        this.study = s;
        this.allWorkflows = this.study.categories.reduce((accumulator, cat) => accumulator.concat(cat.workflows), []);
        this.loading = false;
      });
      this.api.getStudyAssociates(studyId).subscribe(associates => {
        this.associates = associates;
        console.log(associates);
        this.PI = associates.find(function (el) {return el.role = "Primary Investigator";});
      })
    });
  }


  getStatusLabel(status: StudyStatus) {
    return StudyStatusLabels[status.toUpperCase()];
  }

  selectWorkflow(workflowId: number) {
    this.selectedWorkflowId = workflowId;
  }
}
