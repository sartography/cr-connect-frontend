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
  selector: 'app-studies-dashboard',
  templateUrl: './studies-dashboard.component.html',
  styleUrls: ['./studies-dashboard.component.scss']
})
export class StudiesDashboardComponent implements OnInit {
  @Input() studiesByStatus: StudiesByStatus[];
  @Input() beforeStudyIds: number[];
  @Input() afterStudyIds: number[];
  displayedColumns: string[] = [
    'id',
    'title',
    'protocol_builder_status',
    'committees_complete',
    'irb_hsr_status',
    'progress',
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  isNewStudy(studyId: number) {
    return !this.beforeStudyIds.includes(studyId);
  }

  getIrbHsrStatus(study: Study) {
    return IrbHsrStatus.NOT_SUBMITTED;
  }

  getProtocolBuilderStatus(study: Study) {
    return study.protocol_builder_status;
  }

  studiesGroupId(studiesGroup: StudiesByStatus) {
    return 'studies_title_' + studiesGroup.status.toString().toLowerCase();
  }
}
