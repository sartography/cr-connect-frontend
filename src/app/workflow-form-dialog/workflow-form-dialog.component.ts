import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-workflow-form-dialog',
  templateUrl: 'workflow-form-dialog.component.html',
  styleUrls: ['./workflow-form-dialog.component.scss']
})

export class WorkflowFormDialogComponent {
  @ViewChild('OK') el: ElementRef;

  constructor(public dialogRef: MatDialogRef<WorkflowFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private rd: Renderer2) {
  }

  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }

  close() {
    this.dialogRef.close();
  }
}
