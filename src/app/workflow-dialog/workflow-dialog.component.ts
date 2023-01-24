import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-workflow-dialog',
  templateUrl: 'workflow-dialog.component.html',
  styleUrls: ['./workflow-dialog.component.scss']
})

export class WorkflowDialogComponent {

  constructor(public dialogRef: MatDialogRef<WorkflowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private rd: Renderer2) {
  }
}
