import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApiService,
  isNumberDefined,
  StudyStatus,
  StudyStatusLabels,
  Study,
  Workflow,
  WorkflowSpecCategory, WorkflowStats
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
  selectedCategoryId: number;
  selectedCategory: WorkflowSpecCategory;
  selectedWorkflowId: number;
  selectedWorkflow: WorkflowStats;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    this.loadStudy();
  }

  get isCategorySelected(): boolean {
    return isNumberDefined(this.selectedCategoryId);
  }

  get isWorkflowSelected(): boolean {
    return isNumberDefined(this.selectedWorkflowId);
  }

  shrink(len: number, title: string){
    if (title.length > len){
      return title.substr(0,len - 4) + ' ...';
    }
    return title;
  }



  ngOnInit() {
  }

  loadStudy() {
    this.route.paramMap.subscribe(paramMap => {
      const studyId = parseInt(paramMap.get('study_id'), 10);
      this.api.getStudy(studyId).subscribe(s => {
        this.study = s;
        this.allWorkflows = this.study.categories.reduce((accumulator, cat) => {
          return accumulator.concat(cat.workflows);
        }, []);
        this.loading = false;
      });
    });
  }

  getStatusLabel(status: StudyStatus) {
    return StudyStatusLabels[status.toUpperCase()];
  }

  selectCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;

    if (!isNumberDefined(categoryId)) {
      this.selectWorkflow(undefined);
      // this.loadStudy(); # this calls selectWorkflow which will call loadStudy anyhow . . .
    }
  }

  selectWorkflow(workflowId: number) {
    this.selectedWorkflowId = workflowId;

    if (!isNumberDefined(workflowId)) {
      this.loadStudy();
    }
  }
}
