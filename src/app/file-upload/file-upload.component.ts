import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormlyTemplateOptions} from '@ngx-formly/core';
import {FieldType} from '@ngx-formly/material';
import {NgProgressComponent} from '@ngx-progressbar/core';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ReplaySubject} from 'rxjs';
import {ApiService, FileMeta, FileType, Workflow} from 'sartography-workflow-lib';

export interface FormFieldFileReference {
  field_key: string;
  file_meta_id: number;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent extends FieldType implements OnInit {
  @Input() to: FormlyTemplateOptions;
  droppedFiles: NgxFileDropEntry[] = [];
  files = new Set<File>();
  fileMetas = new Set<FileMeta>();
  updateFilesSubject = new ReplaySubject<File[]>();
  displayedColumns: string[] = [
    'type',
    'name',
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

  ngOnInit(): void {
    super.ngOnInit();
    this.model.file_meta_ids = (this.model.file_meta_ids || []) as FormFieldFileReference[];
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
    const s = file.name || file.type;
    const nameArray = s.toLowerCase().split(file.name ? '.' : '/');
    if (nameArray.length > 0) {
      const key = nameArray[nameArray.length - 1];
      return key as FileType;
    } else {
      return FileType.UNKNOWN;
    }
  }

  fileIcon(file: File): string {
    return `/assets/icons/file_types/${this.getFileType(file)}.svg`;
  }

  addFile(file: File) {
    this.files.add(file);
    const fileMeta: FileMeta = {
      content_type: file.type,
      name: file.name,
      type: this.getFileType(file),
      file,
      task_id: this.taskId,
      study_id: this.studyId,
    };
    this.api.addFileMeta({
      study_id: this.studyId,
      workflow_id: this.workflowId,
      task_id: this.taskId
    }, fileMeta).subscribe(fm => {
      this.model.file_meta_ids.push({field_key: this.field.key, file_meta_id: fm.id});
    });
    this.updateFileList();
  }

  removeFile($event, file: File) {
    //  TODO: Delete file
    $event.preventDefault();
    this.files.delete(file);
  }

  editFileMeta(file: File, options) {
    //  TODO: Update file
    this.updateFileList();
  }

  updateFileList() {
    const filesArrary = Array.from(this.files);
    this.model.files = filesArrary;
    this.updateFilesSubject.next(filesArrary);
  }

  private loadFiles() {
    const refs: FormFieldFileReference[] = this.model.file_meta_ids.filter(f => f.field_key === this.field.key);

    refs.forEach(f => {
      this.api.getFileMeta(f.file_meta_id).subscribe(fm => {
        this.fileMetas.add(fm);
        this.api.getFileData(fm.id).subscribe(blob => {
          const file = new File([blob], fm.name, {type: fm.type, lastModified: new Date(fm.last_updated).getTime()});
          this.files.add(file as File);
          if (this.files.size === refs.length) {
            this.updateFileList();
          }
        });
      });
    });
  }
}
