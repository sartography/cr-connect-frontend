import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface WorkflowResetDialogData {
  confirm?: boolean;
  workflowId: number;
  name?: string;
}

@Component({
  selector: 'app-workflow-reset-dialog',
  templateUrl: './workflow-reset-dialog.component.html',
  styleUrls: ['./workflow-reset-dialog.component.scss']
})
export class WorkflowResetDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<WorkflowResetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkflowResetDialogData
  ) {
  }

  onNoClick() {
    this.data.confirm = false;
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.confirm = true;
    this.dialogRef.close(this.data);
  }
}
