import {Component, Input, OnInit} from '@angular/core';
import {Study} from 'sartography-workflow-lib';
import {StudiesByStatus} from '../studies/studies.component';

enum IrbHsrStatus {
  NOT_SUBMITTED = 'Not Submitted',
  SUBMITTED = 'Submitted',
  IN_PRE_REVIEW = 'In Pre-Review',
  ON_AGENDA = 'On Agenda',
  APPROVED = 'Approved',
}

@Component({
  selector: 'app-studies-files-dashboard',
  templateUrl: './studies-files-dashboard.component.html',
  styleUrls: ['./studies-files-dashboard.component.scss']
})
export class StudiesFilesDashboardComponent implements OnInit {
  @Input() studiesByStatus: StudiesByStatus[];
  @Input() beforeStudyIds: number[];
  @Input() afterStudyIds: number[];
  displayedColumns: string[] = [
    'id',
    'comments',
    'docs',
    'current_status',
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  // isNewStudy(studyId: number) {
  //   return !this.beforeStudyIds.includes(studyId);
  // }

  // getIrbHsrStatus(study: Study) {
  //   return IrbHsrStatus.NOT_SUBMITTED;
  // }

  studiesGroupId(studiesGroup: StudiesByStatus) {
    return 'studies_title_' + studiesGroup.status.toString().toLowerCase();
  }
}
