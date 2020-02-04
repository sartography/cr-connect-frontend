import {Component} from '@angular/core';
import {FieldType} from '@ngx-formly/material';

@Component({
  selector: 'app-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss']
})
export class FileFieldComponent extends FieldType {
  selectedFile: File;

  onFileSelected($event: Event) {
    this.selectedFile = ($event.target as HTMLFormElement).files[0];
  }

  getFileName() {
    return this.selectedFile ? this.selectedFile.name : 'Click to select a file';
  }
}
