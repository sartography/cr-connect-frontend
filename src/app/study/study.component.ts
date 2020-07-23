import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApiService,
  FileMeta, isNumberDefined,
  ProtocolBuilderStatus,
  ProtocolBuilderStatusLabels,
  Study,
  Workflow, WorkflowSpecCategory
} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  study: Study;
  displayFiles = false;
  allWorkflows: Workflow[] = [];
  loading = true;
  selectedCategoryId: number;
  selectedCategory: WorkflowSpecCategory;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    const paramMap = this.route.snapshot.paramMap;
    const studyId = parseInt(paramMap.get('study_id'), 10);
    this.api.getStudy(studyId).subscribe(s => {
      this.study = s;
      this.allWorkflows = this.study.categories.reduce((accumulator, cat) => {
        return accumulator.concat(cat.workflows);
      }, []);
      this.loading = false;
    });
  }

  get isCategorySelected(): boolean {
    return isNumberDefined(this.selectedCategoryId);
  }

  get numFiles(): number {
    return this.study && this.study.files ? this.study.files.length : 0;
  }

  ngOnInit() {
  }

  getStatusLabel(status: ProtocolBuilderStatus) {
    return ProtocolBuilderStatusLabels[status.toUpperCase()];
  }

  toggleFilesDisplay(show?: boolean) {
    this.displayFiles = show !== undefined ? show : !this.displayFiles;
  }

  selectCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }
}
