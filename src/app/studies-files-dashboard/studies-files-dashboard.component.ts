import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Study} from 'sartography-workflow-lib';
import {ApprovalsByStatus} from '../studies-rrp/studies-rrp.component';
import {DialogContentExampleDialog} from './studies-files-modal';


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
export class ApprovalsFilesDashboardComponent implements OnInit {
  @Input() approvalsByStatus: ApprovalsByStatus[];
  displayedColumns: string[] = [
    'id',
    'comments',
    'docs',
    'current_status',
  ];

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  // isNewStudy(studyId: number) {
  //   return !this.beforeStudyIds.includes(studyId);
  // }

  // getIrbHsrStatus(study: Study) {
  //   return IrbHsrStatus.NOT_SUBMITTED;
  // }

  approvalsGroupId(approvalsGroup: ApprovalsByStatus) {
    return 'approvals_title_' + approvalsGroup.status.toString().toLowerCase();
  }

  editApproval(approval) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '400px',
      data: {
        approval: approval
      }
    });
  }
}
