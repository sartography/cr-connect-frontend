import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ApiService, FileMeta, Workflow, WorkflowTask} from "sartography-workflow-lib";

@Component({
  selector: 'app-workflow-files',
  templateUrl: './workflow-files.component.html',
  styleUrls: ['./workflow-files.component.scss']
})
export class WorkflowFilesComponent implements OnInit, OnChanges {

  @Input() workflow: Workflow;
  files: FileMeta[];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.updateFileList();
  }

  ngOnChanges() {
    this.updateFileList();
  }

  private updateFileList() {
    this.api.listWorkflowFiles(this.workflow.id).subscribe(files => {
      this.files = files;
    });
  }

  public downloadFile(fileMeta: FileMeta): void {
    this.api.getFileData(fileMeta.id)
      .subscribe(x => {
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const newBlob = new Blob([x], { type: fileMeta.content_type });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = data;
        link.download = fileMeta.name;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      });
  }

}
