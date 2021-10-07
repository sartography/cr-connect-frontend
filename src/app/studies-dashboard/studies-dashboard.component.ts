import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ApiService, StudyStatus, StudyStatusLabels, Study, TaskAction, TaskEvent, UserService, User} from 'sartography-workflow-lib';
import {TaskLane} from '../_interfaces/task-lane';
import {StudiesByStatus} from '../studies/studies.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmStudyStatusDialogComponent} from '../_dialogs/confirm-study-status-dialog/confirm-study-status-dialog.component';
import {ConfirmStudyStatusDialogData} from '../_interfaces/dialog-data';
import {StudyAction} from '../_interfaces/study-action';
import { cloneDeep } from 'lodash';
import {MatTableDataSource} from '@angular/material/table';
import * as timeago from 'timeago.js';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { shrink } from '../_util/shrink';

enum IrbHsrStatus {
  NOT_SUBMITTED = 'Not Submitted',
  SUBMITTED = 'Submitted',
  IN_PRE_REVIEW = 'In Pre-Review',
  ON_AGENDA = 'On Agenda',
  APPROVED = 'Approved',
}

enum StudyStatusDisplayType {
  NEW = 'New',
  IRB = 'Irb',
  PROGRESS = 'Progress'
}

@Component({
  selector: 'app-studies-dashboard',
  templateUrl: './studies-dashboard.component.html',
  styleUrls: ['./studies-dashboard.component.scss']
})
export class StudiesDashboardComponent {
  @Input() studiesByStatus: StudiesByStatus[];
  @Input() beforeStudyIds: number[];
  @Input() afterStudyIds: number[];
  @Output() studyUpdated = new EventEmitter<Study>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentTab = 0;
  shrink = shrink;
  public user: User;
  displayedColumns: string[] = [
    'id',
    'title',
    'status',
    'reviews_complete',
    'updated',
    'created',
    'actions',
  ];
  approvalColumns: string[] = [
    'user_display',
    'study.title',
    'workflow.category_display_name',
    'task_title',
    'date',
  ];
  defaultStudyActionForm: FormlyFieldConfig[] = [
    {
      key: 'comment',
      type: 'textarea',
      templateOptions: {
        label: 'Comment',
        rows: 5,
      },
    }
  ];

  studyActions: StudyAction[] = [
    {
      showIf: (study) => this.statusIs(study, [StudyStatus.IN_PROGRESS]),
      buttonIcon: 'fast_rewind',
      buttonLabel: 'Reset study...',
      tooltipText: 'Reset all CR Connect data for <study_title>',
      dialogTitle: 'Really reset all the data for <study_title>?',
      dialogDescription: 'This will delete any data you have entered into CR Connect for this study (i.e., any data outside of Protocol Builder). It cannot be undone.',
      method: 'deleteStudy',
    },
    {
      showIf: (study) => this.statusIs(study, [StudyStatus.IN_PROGRESS]),
      buttonIcon: 'pause',
      buttonLabel: 'Place study on hold...',
      tooltipText: 'Set the status of <study_title> to "Hold"',
      dialogTitle: 'Really put <study_title> on hold?',
      dialogDescription: `This will put the study on hold, pausing notifications and approvals for the time being. You may take the study off hold at any time.`,
      dialogFormFields: this.defaultStudyActionForm,
      method: (study, model) => {
        study.status = StudyStatus.HOLD;
        study.comment = model.comment;
        return study;
      },
    },
    {
      showIf: (study) => this.statusIs(study, [StudyStatus.IN_PROGRESS]),
      buttonIcon: 'send',
      buttonLabel: 'Open study to enrollment...',
      tooltipText: 'Set the status of <study_title> to "Open To Enrollment"',
      dialogTitle: 'Really open <study_title> to enrollment?',
      dialogDescription: `This will open the study to enrollment on the specified launch date.`,
      dialogFormFields: this.enrollmentDateForm(),
      method: (study, model) => {
        study.status = StudyStatus.OPEN_FOR_ENROLLMENT;
        study.enrollment_date = model.enrollmentDate;
        study.comment = model.comment;
        return study;
      },
    },
    {
      showIf: (study) => this.statusIs(study, [StudyStatus.IN_PROGRESS]),
      buttonIcon: 'stop',
      buttonLabel: 'Abandon study...',
      tooltipText: 'Set the status of <study_title> to "Abandoned"',
      dialogTitle: 'Really abandon <study_title>?',
      dialogDescription: `This will change the status of this study to "Abandoned", preventing the study from appearing in anyone's approval queue. You may un-abandon the study at any time.`,
      dialogFormFields: this.defaultStudyActionForm,
      method: (study, model) => {
        study.status = StudyStatus.ABANDONED;
        study.comment = model.comment;
        return study;
      },
    },
    {
      showIf: (study) => this.statusIs(study, [StudyStatus.ABANDONED, StudyStatus.HOLD]),
      buttonIcon: 'play',
      buttonLabel: 'Resume study...',
      tooltipText: 'Set the status of <study_title> to "In progress"',
      dialogTitle: 'Really resume <study_title>?',
      dialogDescription: `This will set the status of this study to "In progress", resuming any notifications and approvals.`,
      dialogFormFields: this.defaultStudyActionForm,
      method: (study, model) => {
        study.status = StudyStatus.IN_PROGRESS;
        study.comment = model.comment;
        return study;
      },
    },
  ];
  approvalsDataSource: MatTableDataSource<TaskEvent>;
  taskLanes: TaskLane[] = [
    {value: 'supervisor', label: 'Approvals'},
  ];
  selectedTaskLane: TaskLane = this.taskLanes[0];

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private userService: UserService,
  ) {
    this.loadTaskEvents();
    this.userService.user$.subscribe(u=>this.user=u);
  }

  get hasTaskEvents(): boolean {
    return !!(
      this.approvalsDataSource &&
      this.approvalsDataSource.filteredData &&
      this.approvalsDataSource.filteredData.length > 0
    );
  }

  changeTab(currentTab: number){
    this.currentTab = currentTab
  }


  studyStatusDisplayType(study: Study) {
    if (this.isNewStudy(study)) { return StudyStatusDisplayType.NEW;}
    if (this.getIrbHsrStatus(study) !== IrbHsrStatus.NOT_SUBMITTED) { return StudyStatusDisplayType.IRB;}
    return StudyStatusDisplayType.PROGRESS;
  }

  isNewStudy(study: Study) {
    return !this.beforeStudyIds.includes(study.id);
  }

  getIrbHsrStatus(study: Study) {
    return IrbHsrStatus.NOT_SUBMITTED;
  }

  getStudyStatus(study: Study) {
    return StudyStatusLabels[study.status.toUpperCase()];
  }

  studiesGroupId(studiesGroup: StudiesByStatus) {
    return 'studies_title_' + studiesGroup.status.toString().toLowerCase();
  }

  openConfirmationDialog(study: Study, selectedAction: StudyAction) {
    const action: StudyAction = cloneDeep(selectedAction);
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

  statusIs(study: Study, statuses: StudyStatus[]) {
    return statuses.some(s => study.status.toString().toLowerCase() === s.toString().toLowerCase());
  }

  timeAgo(date: Date) {
    return timeago.format(date);
  }

  loadTaskEvents() {
    this.api
      .getTaskEvents(TaskAction.ASSIGNMENT)
      .subscribe(t => {
        this.approvalsDataSource = new MatTableDataSource(t);
        this.approvalsDataSource.paginator = this.paginator;
        this.approvalsDataSource.filterPredicate = (taskEvent: TaskEvent, filter) => this._taskLanesAreEqual(taskEvent.task_lane, this.selectedTaskLane.value);

        // Sending the filter a non-empty string so it will update.
        this.approvalsDataSource.filter = this.selectedTaskLane.label;
        this.approvalsDataSource.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'task_title': return item.task_title.toLowerCase();
            case 'study.title': return item.study.title.toLowerCase();
            case 'workflow.category_display_name': return item.workflow.display_name.toLowerCase() +
              item.workflow.display_name.toLowerCase();
            default: return item[property];
          }
        };
        this.approvalsDataSource.sort = this.sort;
      });
  }

  toggleTaskLane($event: MatButtonToggleChange) {
    this.selectedTaskLane = $event.value;

    // Sending the filter a non-empty string so it will update.
    this.approvalsDataSource.filter = this.selectedTaskLane.label;
  }

  numTasksInTaskLane(taskLane: TaskLane): number {
    if (this.approvalsDataSource && this.approvalsDataSource.data && this.approvalsDataSource.data.length > 0) {
      return this.approvalsDataSource.data.filter(taskEvent => this._taskLanesAreEqual(taskEvent.task_lane, taskLane.value)).length;
    }

    return 0;
  }

  // Returns true if given task lanes are equal.
  // If either value is falsey, use '' for the comparison.
  private _taskLanesAreEqual(a, b): boolean {
    if (((a || '') === '') && ((b || '') === '')) {
      return true
    } else {
      return (((a || '') !== '') && ((b || '') !== ''))

    }
  }

  private _updateStudy(data: ConfirmStudyStatusDialogData) {
    if (typeof data.action.method === 'string') {
      this.api[data.action.method](data.study.id).subscribe(s => this.studyUpdated.emit(s));
    } else {
      const updatedStudy: Study = data.action.method(data.study, data.model);
      this.api.updateStudy(data.study.id, updatedStudy).subscribe(s => this.studyUpdated.emit(s));
    }
  }

  private enrollmentDateForm() {
    const formFields: FormlyFieldConfig[] = cloneDeep(this.defaultStudyActionForm) as FormlyFieldConfig[];
    formFields.push({
      key: 'enrollmentDate',
      type: 'datepicker',
      templateOptions: {
        label: 'Date enrollment will begin',
      },
    });
    return formFields;
  }
}
