import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormlyTemplateOptions} from '@ngx-formly/core';
import {FieldType} from '@ngx-formly/material';
import {NgProgressComponent} from '@ngx-progressbar/core';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ReplaySubject} from 'rxjs';
import {ApiService, FileMeta, FileParams} from 'sartography-workflow-lib';
import {getFileIcon, getFileType} from '../_util/file-type';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent extends FieldType implements OnInit {
  @Input() to: FormlyTemplateOptions;
  droppedFiles: NgxFileDropEntry[] = [];
  fileMetas = new Set<FileMeta>();
  updateFileMetasSubject = new ReplaySubject<FileMeta[]>();
  displayedColumns: string[] = [
    'type',
    'name',
    'size',
    'lastModifiedDate',
    'actions'
  ];
  dropZoneHover = false;
  @ViewChild(NgProgressComponent, {static: false}) progress: NgProgressComponent;
  getFileIcon = getFileIcon;
  private studyId: number;
  private workflowId: number;
  private taskId: string;
  private fileParams: FileParams;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
  ) {
    super();
    this.route.paramMap.subscribe(paramMap => {
      this.studyId = parseInt(paramMap.get('study_id'), 10);
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
      this.taskId = paramMap.get('task_id');
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.fileParams = {
      study_id: this.studyId,
      workflow_id: this.workflowId,
      task_id: this.taskId,
      form_field_key: this.field.key
    };
    this.loadFiles();
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

  addFile(file: File) {
    const fileMeta: FileMeta = {
      content_type: file.type,
      name: file.name,
      type: getFileType(file),
      file,
      study_id: this.studyId,
      workflow_id: this.workflowId,
      task_id: this.taskId,
      form_field_key: this.field.key,
    };
    this.api.addFileMeta(this.fileParams, fileMeta).subscribe(fm => {
      fm.file = file;
      this.fileMetas.add(fm);
      this.updateFileList();
    });
  }

  removeFile($event, fileMeta: FileMeta) {
    $event.preventDefault();
    const fileMetaId = fileMeta.id;

    this.api.deleteFileMeta(fileMetaId).subscribe(() => {
      this.fileMetas.delete(fileMeta);
      this.updateFileList();
    });
  }

  updateFileList() {
    const fileMetasArray = Array.from(this.fileMetas);
    this.updateFileMetasSubject.next(fileMetasArray);
  }

  private loadFiles() {
    this.api.getFileMetas(this.fileParams).subscribe(fms => {
      fms.forEach(fm => {
        this.api.getFileData(fm.id).subscribe(blob => {
          const options: FilePropertyBag = {
            type: fm.type,
            lastModified: new Date(fm.last_updated).getTime()
          };
          fm.file = new File([blob], fm.name, options);
          this.fileMetas.add(fm);
          if (this.fileMetas.size === fms.length) {
            this.updateFileList();
          }
        });
      });
    });
  }
}
