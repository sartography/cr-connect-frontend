import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService, Approval, ApprovalFile, ApprovalStatusLabels} from 'sartography-workflow-lib';
import {ApprovalsByStatus} from '../approvals/approvals.component';
import {ApprovalDialogComponent} from '../_dialogs/approval-dialog/approval-dialog.component';

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
  @Input() approvalsByStatus: ApprovalsByStatus;
  @Input() approveButtons: boolean;
  @Output() approvalStatusChanged = new EventEmitter<Approval>();
  displayedColumns: string[] = [
    'id',
    'comments',
    'docs',
    'creation_date',
    'approval_date',
    'current_status',
  ];
  approvalStatusLabels = ApprovalStatusLabels;

  constructor(public dialog: MatDialog,
    private api: ApiService) {
  }


  ngOnInit(): void {
  }

  approvalsGroupId(approvalsGroup: ApprovalsByStatus) {
    return 'approvals_title_' + approvalsGroup.status.toString().toLowerCase();
  }

  editApproval(approval) {
    const dialogRef = this.dialog.open(ApprovalDialogComponent, {
      width: '400px',
      data: {
        approval
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.api.updateApproval(data.approval).subscribe(a => this.approvalStatusChanged.emit(a));
    });
  }

  downloadFile(fileMeta: ApprovalFile): void {
    this.api.getFileData(fileMeta.id).subscribe(response => {
      // It is necessary to create a new response object with mime-type explicitly set
      // otherwise only Chrome works like it should
      const newBlob = new Blob([response.body], {type: fileMeta.content_type});

      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = data;
      link.download = fileMeta.name;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    });
  }
}
