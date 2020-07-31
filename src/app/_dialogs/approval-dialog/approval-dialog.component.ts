import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppEnvironment, Approval, ApprovalStatus} from 'sartography-workflow-lib';

export interface ApprovalDialogData {
  approval: Approval;
}

@Component({
  selector: 'app-approval-dialog',
  templateUrl: 'approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.scss']
})
export class ApprovalDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ApprovalDialogData,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    public dialogRef: MatDialogRef<ApprovalDialogComponent>
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit(approve: boolean, message: string) {
    this.data.approval.message = message ? message : 'Empty message';
    this.data.approval.status = approve ? ApprovalStatus.APPROVED : ApprovalStatus.DECLINED;
    this.dialogRef.close(this.data);
  }
}
