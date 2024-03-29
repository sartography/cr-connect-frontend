import {Component, Input} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-code-viewer',
  templateUrl: './code-viewer.component.html',
  styleUrls: ['./code-viewer.component.scss']
})
export class CodeViewerComponent {
  @Input() data: any;

  constructor(private snackBar: MatSnackBar) { }

  confirmCopy() {
    this.snackBar.open('Data copied to clipboard.', 'Ok', {duration: 2000});
  }
}
