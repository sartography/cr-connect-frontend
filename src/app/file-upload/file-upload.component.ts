import {Component, Input, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormlyTemplateOptions} from '@ngx-formly/core';
import {FieldType} from '@ngx-formly/material';
import {NgProgressComponent} from '@ngx-progressbar/core';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ReplaySubject} from 'rxjs';
import {ApiService, FileMeta, FileType, Workflow} from 'sartography-workflow-lib';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent extends FieldType {
  @Input() to: FormlyTemplateOptions;
  droppedFiles: NgxFileDropEntry[] = [];
  files = new Set<File>();
  fileMetas: FileMeta[] = [];
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
  private workflowSpecId: string;
  private studyId: number;
  private workflowId: number;
  private taskId: string;

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
    activatedRoute.paramMap.subscribe(paramMap => {
      this.studyId = parseInt(paramMap.get('study_id'), 10);
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
      this.taskId = paramMap.get('task_id');
      this.api.getWorkflow(this.workflowId).subscribe(wf => {
        this.workflowSpecId = wf.workflow_spec_id;
        this.loadFiles();
      });
    });
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

  getFileType(file: File): FileType {
    const s = file.type || file.name;
    const nameArray = s.toLowerCase().split(file.type ? '/' : '.');
    if (nameArray.length > 0) {
      return FileType[nameArray[nameArray.length - 1]];
    } else {
      return FileType.UNKNOWN;
    }
  }

  fileIcon(file: File): string {
    return `/assets/icons/file_types/${this.getFileType(file)}.svg`;
  }

  addFile(file: File) {
    console.log('=== addFile ===');

    //  TODO: Add file
    this.files.add(file);
    const fileMeta: FileMeta = {
      content_type: file.type,
      name: file.name,
      type: this.getFileType(file),
      file,
      task_id: this.taskId,
      study_id: this.studyId,
    };
    this.api.addFileMeta({study_id: this.studyId, task_id: this.taskId}, fileMeta);
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

  private loadFiles() {
    this.api.getFileMeta({task_id: this.taskId}).subscribe(fms => {
      this.fileMetas = fms;
      this.fileMetas.forEach(fm => {
        this.api.getFileData(fm.id).subscribe(file => this.files.add(file as File));
      });
    });
  }
}
