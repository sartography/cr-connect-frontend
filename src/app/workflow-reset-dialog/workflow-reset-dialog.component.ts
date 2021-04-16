import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface WorkflowResetDialogData {
  confirm?: boolean;
  clearData?: boolean;
  deleteFiles?: boolean;
  workflowId: number;
  name?: string;
}

@Component({
  selector: 'app-workflow-reset-dialog',
  templateUrl: './workflow-reset-dialog.component.html',
  styleUrls: ['./workflow-reset-dialog.component.scss']
})
export class WorkflowResetDialogComponent {

  clearData = false;
  deleteFiles = false;

  constructor(
    public dialogRef: MatDialogRef<WorkflowResetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkflowResetDialogData
  ) {
  }

  toggleClearData() {
    this.clearData = !this.clearData;
    if(!this.clearData) {
      this.deleteFiles = false;
    }
  }

  toggleDeleteFiles() {
    this.deleteFiles = !this.deleteFiles;
  }


  onNoClick() {
    this.data.confirm = false;
    this.data.clearData = false;
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.confirm = true;
    this.data.clearData = this.clearData;
    this.data.deleteFiles = this.deleteFiles;
    this.dialogRef.close(this.data);
  }
}
