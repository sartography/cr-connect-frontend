import {Component, Input, OnInit} from '@angular/core';
import {StudiesByStatus} from '../studies/studies.component';

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
    'irb_hsr_status',
    'protocol_builder_status',
    'progress',
    'committees_complete',
  ];

  constructor() { }

  ngOnInit(): void {
  }

  isNewStudy(studyId: number) {
    return !this.beforeStudyIds.includes(studyId);
  }
}
