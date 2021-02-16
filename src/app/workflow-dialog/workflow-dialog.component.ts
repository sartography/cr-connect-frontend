import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-workflow-dialog',
  templateUrl: './workflow-dialog.component.html',
  styleUrls: ['./workflow-dialog.component.scss']
})

export class WorkflowDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }
}

