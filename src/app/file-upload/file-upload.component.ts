import {Component, Input, ViewChild} from '@angular/core';
import {FormlyTemplateOptions} from '@ngx-formly/core';
import {FieldType} from '@ngx-formly/material';
import {NgProgressComponent} from '@ngx-progressbar/core';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ReplaySubject} from 'rxjs';
import {ApiService} from 'sartography-workflow-lib';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent extends FieldType {
  @Input() to: FormlyTemplateOptions;
  droppedFiles: NgxFileDropEntry[] = [];
  files = new Set<File>();
  updateFilesSubject = new ReplaySubject<File[]>();
  displayedColumns: string[] = [
    'name',
    'display_name',
    'type',
    'size',
    'lastModifiedDate',
    'actions'
  ];
  dropZoneHover = false;
  @ViewChild(NgProgressComponent, {static: false}) progress: NgProgressComponent;

  constructor(private api: ApiService) {
    super();
  }

  dropped(droppedFiles: NgxFileDropEntry[]) {
    this.droppedFiles = droppedFiles;
    this.dropZoneHover = false;
    this.droppedFiles.forEach((droppedFile, i) => {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((newFile: File) => this.addFile(newFile));
      }
    });

    this.updateFileList();
  }

  fileOver($event) {
    this.dropZoneHover = true;
  }

  fileLeave($event) {
    this.dropZoneHover = false;
  }

  formatSize(bytes: number, decimalPlaces = 2): string {
    const sizes = ['KB', 'MB', 'GB', 'TB'];
    const factor = Math.pow(10, decimalPlaces);

    for (let i = 0; i < sizes.length; i++) {
      const divisor = Math.pow(10, (3 * (i + 1)));
      const nextDivisor = Math.pow(10, (3 * (i + 2)));

      if (bytes < nextDivisor) {
        return `${Math.round(bytes / divisor * factor) / factor} ${sizes[i]}`;
      }
    }
  }

  formatDate(d: Date | string | number): string {
    const dateObj = (d instanceof Date) ? d : new Date(d);

    return `
      ${dateObj.getFullYear()}/${dateObj.getMonth()}/${dateObj.getDay()}
      ${dateObj.getHours()}:${dateObj.getMinutes()}
    `;
  }

  truncate(s: string, maxLength = 20): string {
    if (s) {
      if (s.length > (maxLength - 3)) {
        return s.slice(0, maxLength) + '...';
      } else {
        return s;
      }
    } else {
      return '';
    }
  }

  fileIcon(file: File): string {
    const s = file.type || file.name;
    const nameArray = s.toLowerCase().split(file.type ? '/' : '.');
    if (nameArray.length > 0) {
      return `/assets/icons/file_types/${nameArray[nameArray.length - 1]}.svg`;
    } else {
      return `/assets/icons/file_types/unknown.svg`;
    }
  }

  addFile(file: File) {
    console.log('=== addFile ===');

    //  TODO: Add file
    this.files.add(file);
    this.updateFileList();
  }

  removeFile($event, file: File) {
    console.log('=== removeFile ===');

    //  TODO: Delete file
    $event.preventDefault();
    this.files.delete(file);
  }

  editFileMeta(file: File, options) {
    console.log('=== editFileMeta ===');

    //  TODO: Update file
    this.updateFileList();
  }

  updateFileList() {
    console.log('=== updateFileList ===');
    const filesArrary = Array.from(this.files);
    this.model.files = filesArrary;
    this.updateFilesSubject.next(filesArrary);
  }

  updateDisplayName($event, file: File) {
    console.log('=== updateDisplayName ===');
    this.editFileMeta(file, {display_name: $event.target.value});
  }
}
