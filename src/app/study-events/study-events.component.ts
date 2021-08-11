import {Component, Input} from '@angular/core';
import {Study, StudyEventType, StudyEvent, StudyEventTypeLabels, StudyStatus, StudyStatusLabels} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study-events',
  templateUrl: './study-events.component.html',
  styleUrls: ['./study-events.component.scss']
})
export class StudyEventsComponent {
  @Input() study: Study;
  displayedColumns: string[] = [
    'create_date',
    'status',
    'comment',
    'event_type',
  ];
  studyEventType = StudyEventType;
  studyEventTypeLabels = StudyEventTypeLabels;

  constructor() {
  }

  getStatusLabel(status) {
    return StudyStatusLabels[status.toUpperCase()];
  }

  getEventTypeLabel(status) {
    return StudyEventTypeLabels[status.toUpperCase()];
  }

  eventsGroupId() {
    return 'study_events';
  }

}
