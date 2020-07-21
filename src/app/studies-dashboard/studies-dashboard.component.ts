import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService, ProtocolBuilderStatus, Study, TaskAction, TaskEvent} from 'sartography-workflow-lib';
import {StudiesByStatus} from '../studies/studies.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmStudyStatusDialogComponent} from '../_dialogs/confirm-study-status-dialog/confirm-study-status-dialog.component';
import {ConfirmStudyStatusDialogData} from '../_interfaces/dialog-data';
import {StudyAction} from '../_interfaces/study-action';
import createClone from 'rfdc';


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
  @Output() studyUpdated = new EventEmitter<Study>();
  displayedColumns: string[] = [
    'id',
    'title',
    'protocol_builder_status',
    'committees_complete',
    'irb_hsr_status',
    'progress',
    'actions',
  ];

  studyActions: StudyAction[] = [
    {
      showIf: (study) => [ProtocolBuilderStatus.ACTIVE].includes(study.protocol_builder_status),
      buttonIcon: 'fast_rewind',
      buttonLabel: 'Reset study...',
      tooltipText: 'Reset all CR Connect data for <study_title>',
      dialogTitle: 'Really reset all the data for <study_title>?',
      dialogDescription: 'This will delete any data you have entered into CR Connect for this study (i.e., any data outside of Protocol Builder). It cannot be undone.',
      method: 'deleteStudy',
    },
    {
      showIf: (study) => study.protocol_builder_status === ProtocolBuilderStatus.ACTIVE,
      buttonIcon: 'pause',
      buttonLabel: 'Place study on hold...',
      tooltipText: 'Set the status of <study_title> to "Hold"',
      dialogTitle: 'Really put <study_title> on hold?',
      dialogDescription: `This will put the study on hold, pausing notifications and approvals for the time being. You may take the study off hold at any time.`,
      method: 'holdStudy',
    },
    {
      showIf: (study) => this.statusIs(study, [ProtocolBuilderStatus.ACTIVE]),
      buttonIcon: 'send',
      buttonLabel: 'Open study to enrollment...',
      tooltipText: 'Set the status of <study_title> to "Open To Enrollment"',
      dialogTitle: 'Really open <study_title> to enrollment?',
      dialogDescription: `This will open the study to enrollment on the specified launch date.`,
      method: 'openStudy',
    },
    {
      showIf: (study) => study.protocol_builder_status === ProtocolBuilderStatus.ACTIVE,
      buttonIcon: 'stop',
      buttonLabel: 'Abandon study...',
      tooltipText: 'Set the status of <study_title> to "Abandoned"',
      dialogTitle: 'Really abandon <study_title>?',
      dialogDescription: `This will change the status of this study to "Abandoned", preventing the study from appearing in anyone's approval queue. You may un-abandon the study at any time.`,
      method: 'abandonStudy',
    },
    {
      showIf: (study) => [ProtocolBuilderStatus.ABANDONED, ProtocolBuilderStatus.HOLD].includes(study.protocol_builder_status),
      buttonIcon: 'play',
      buttonLabel: 'Resume study...',
      tooltipText: 'Set the status of <study_title> to "In progress"',
      dialogTitle: 'Really resume <study_title>?',
      dialogDescription: `This will set the status of this study to "In progress", resuming any notifications and approvals.`,
      method: 'resumeStudy',
    },
  ];
  taskEvents: TaskEvent[];

  constructor(
    private api: ApiService,
    public dialog: MatDialog
  ) {
    this.api.getTaskEvents(TaskAction.ASSIGNMENT).subscribe(t => this.taskEvents = t);
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

  openConfirmationDialog(study: Study, selectedAction: StudyAction) {
    console.log('Set selectedStudy state to:', selectedAction);
    const action: StudyAction = createClone()(selectedAction);
    action.dialogTitle = this.insertStudyTitle(action.dialogTitle, study);
    action.dialogDescription = this.insertStudyTitle(action.dialogDescription, study);
    const dialogData: ConfirmStudyStatusDialogData = {
      action,
      confirm: false,
      study,
    };

    const dialogRef = this.dialog.open(ConfirmStudyStatusDialogComponent, {
      height: '65vh',
      width: '50vw',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: ConfirmStudyStatusDialogData) => {
      if (data && data.confirm && data.action && data.study) {
        // TODO: Add API methods for each study action (deleteStudy, holdStudy, openStudy, abandonStudy, resumeStudy)
        // this.api[data.action.method](data.study.id).subscribe(updatedStudy => this.studyUpdated.emit(updatedStudy));
      }
    });
  }

  insertStudyTitle(text: string, study: Study): string {
    return text.replace('<study_title>', study.title);
  }

  statusIs(study: Study, statuses: ProtocolBuilderStatus[]) {
    return statuses.some(s => study.protocol_builder_status.toString().toLowerCase() === s.toString().toLowerCase());
  }
}
