import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FieldType} from '@ngx-formly/material';
import {ApiService, FileMeta, FileParams} from 'sartography-workflow-lib';
import {getFileType} from '../_util/file-type';

@Component({
  selector: 'app-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss']
})
export class FileFieldComponent extends FieldType implements OnInit {
  selectedFile: File;
  selectedFileMeta: FileMeta;
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

  onFileSelected($event: Event) {
    this.selectedFile = ($event.target as HTMLFormElement).files[0];

    if (this.selectedFile) {
      this.addFile(this.selectedFile);
    } else if (this.selectedFileMeta && this.selectedFileMeta.file) {
      this.selectedFile = this.selectedFileMeta.file;
    }
  }

  getFileName() {
    return this.selectedFile ? this.selectedFile.name : 'Click to select a file';
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
      fm.file = this.selectedFile;
      this.selectedFileMeta = fm;
      this.loadFiles();
    });
  }

  removeFile() {
    if (this.selectedFileMeta) {
      this.api.deleteFileMeta(this.selectedFileMeta.id).subscribe(() => {
        this.selectedFile = undefined;
        this.selectedFileMeta = undefined;
        this.loadFiles();
      });
    }
  }

  private loadFiles() {
    this.api.getFileMetas(this.fileParams).subscribe(fms => {
      fms.forEach(fm => {
        this.api.getFileData(fm.id).subscribe(blob => {
          const file = new File([blob], fm.name, {type: fm.type, lastModified: new Date(fm.last_updated).getTime()});
          fm.file = file;
          this.selectedFileMeta = fm;
          this.selectedFile = file;
        });
      });
    });
  }
}
