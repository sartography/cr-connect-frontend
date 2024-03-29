import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfirmStudyStatusDialogData} from '../../_interfaces/dialog-data';
import {UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'app-confirm-study-status-dialog',
  templateUrl: './confirm-study-status-dialog.component.html',
  styleUrls: ['./confirm-study-status-dialog.component.scss']
})
export class ConfirmStudyStatusDialogComponent {
  form = new UntypedFormGroup({});

  constructor(
    public dialogRef: MatDialogRef<ConfirmStudyStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmStudyStatusDialogData
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    const data: ConfirmStudyStatusDialogData = {
      action: this.data.action,
      confirm: true,
      study: this.data.study,
      model: this.data.model,
    };
    this.dialogRef.close(data);
  }

}
