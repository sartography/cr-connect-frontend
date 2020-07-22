import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService, ProtocolBuilderStatus, Study, TaskAction, TaskEvent} from 'sartography-workflow-lib';
import {StudiesByStatus} from '../studies/studies.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmStudyStatusDialogComponent} from '../_dialogs/confirm-study-status-dialog/confirm-study-status-dialog.component';
import {ConfirmStudyStatusDialogData} from '../_interfaces/dialog-data';
import {StudyAction} from '../_interfaces/study-action';
import createClone from 'rfdc';
import {MatTableDataSource} from '@angular/material/table';


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
  approvalColumns: string[] = [
    'approval_study',
    'approval_workflow',
    'approval_task',
  ];

  studyActions: StudyAction[] = [
    {
      showIf: (study) => this.statusIs(study, [ProtocolBuilderStatus.ACTIVE]),
      buttonIcon: 'fast_rewind',
      buttonLabel: 'Reset study...',
      tooltipText: 'Reset all CR Connect data for <study_title>',
      dialogTitle: 'Really reset all the data for <study_title>?',
      dialogDescription: 'This will delete any data you have entered into CR Connect for this study (i.e., any data outside of Protocol Builder). It cannot be undone.',
      method: 'deleteStudy',
    },
    {
      showIf: (study) => this.statusIs(study, [ProtocolBuilderStatus.ACTIVE]),
      buttonIcon: 'pause',
      buttonLabel: 'Place study on hold...',
      tooltipText: 'Set the status of <study_title> to "Hold"',
      dialogTitle: 'Really put <study_title> on hold?',
      dialogDescription: `This will put the study on hold, pausing notifications and approvals for the time being. You may take the study off hold at any time.`,
      method: (study) => {
        study.protocol_builder_status = ProtocolBuilderStatus.HOLD;
        return study;
      },
    },
    {
      showIf: (study) => this.statusIs(study, [ProtocolBuilderStatus.ACTIVE]),
      buttonIcon: 'send',
      buttonLabel: 'Open study to enrollment...',
      tooltipText: 'Set the status of <study_title> to "Open To Enrollment"',
      dialogTitle: 'Really open <study_title> to enrollment?',
      dialogDescription: `This will open the study to enrollment on the specified launch date.`,
      dialogFormFields: [{
        key: 'enrollmentDate',
        type: 'datepicker',
        templateOptions: {
          label: 'Date enrollment will begin',
        }
      }],
      method: (study, enrollmentDate) => {
        study.protocol_builder_status = ProtocolBuilderStatus.OPEN;
        study.enrollment_date = enrollmentDate;
        return study;
      },
    },
    {
      showIf: (study) => this.statusIs(study, [ProtocolBuilderStatus.ACTIVE]),
      buttonIcon: 'stop',
      buttonLabel: 'Abandon study...',
      tooltipText: 'Set the status of <study_title> to "Abandoned"',
      dialogTitle: 'Really abandon <study_title>?',
      dialogDescription: `This will change the status of this study to "Abandoned", preventing the study from appearing in anyone's approval queue. You may un-abandon the study at any time.`,
      method: (study) => {
        study.protocol_builder_status = ProtocolBuilderStatus.ABANDONED;
        return study;
      },
    },
    {
      showIf: (study) => this.statusIs(study, [ProtocolBuilderStatus.ABANDONED, ProtocolBuilderStatus.HOLD]),
      buttonIcon: 'play',
      buttonLabel: 'Resume study...',
      tooltipText: 'Set the status of <study_title> to "In progress"',
      dialogTitle: 'Really resume <study_title>?',
      dialogDescription: `This will set the status of this study to "In progress", resuming any notifications and approvals.`,
      method: (study) => {
        study.protocol_builder_status = ProtocolBuilderStatus.ACTIVE;
        return study;
      },
    },
  ];
  approvalsDataSource: MatTableDataSource<TaskEvent>;

  constructor(
    private api: ApiService,
    public dialog: MatDialog
  ) {
    this.api
      .getTaskEvents(TaskAction.ASSIGNMENT)
      .subscribe(t => this.approvalsDataSource = new MatTableDataSource(t));
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
    const action: StudyAction = createClone()(selectedAction);
    action.dialogTitle = this.insertStudyTitle(action.dialogTitle, study);
    action.dialogDescription = this.insertStudyTitle(action.dialogDescription, study);
    const dialogData: ConfirmStudyStatusDialogData = {
      action,
      confirm: false,
      study,
    };

    if (action.dialogFormFields) {
      dialogData.formFields = action.dialogFormFields;
      dialogData.model = {};
    }

    const dialogRef = this.dialog.open(ConfirmStudyStatusDialogComponent, {
      height: '65vh',
      width: '50vw',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: ConfirmStudyStatusDialogData) => {
      if (data && data.confirm && data.action && data.study) {
        this._updateStudy(data);
      }
    });
  }

  insertStudyTitle(text: string, study: Study): string {
    return text.replace('<study_title>', study.title);
  }

  statusIs(study: Study, statuses: ProtocolBuilderStatus[]) {
    return statuses.some(s => study.protocol_builder_status.toString().toLowerCase() === s.toString().toLowerCase());
  }

  private _updateStudy(data: ConfirmStudyStatusDialogData) {
    if (typeof data.action.method === 'string') {
      this.api[data.action.method](data.study.id).subscribe(s => this.studyUpdated.emit(s));
    } else {
      const updatedStudy = data.action.method(data.study, data.model);
      this.api.updateStudy(data.study.id, updatedStudy).subscribe(s => this.studyUpdated.emit(s));
    }
  }
}
