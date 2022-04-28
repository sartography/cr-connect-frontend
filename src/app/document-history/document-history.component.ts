import {Component, Input, OnInit, OnChanges, AfterViewInit, SimpleChanges} from '@angular/core';
import {ApiService, DocumentDirectory, Study, FileMeta} from 'sartography-workflow-lib';
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";

@Component({
  selector: 'app-document-history',
  templateUrl: './document-history.component.html',
  styleUrls: ['./document-history.component.scss']
})
export class DocumentHistoryComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() study: Study;
  @Input() directory: DocumentDirectory[];
  typeLabel: string;
  treeControl = new NestedTreeControl<DocumentDirectory>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DocumentDirectory>();
  hoverFile: FileMeta;


  constructor(private api: ApiService) { }

  ngOnChanges(changes: SimpleChanges){
    this.dataSource.data = this.directory;
    this.treeControl.dataNodes = this.directory;
    setTimeout(() => this.expandNodes(this.directory), 10);
  }

  hasChild = (_: number, node: DocumentDirectory) => node.children.length > 0;

  ngAfterViewInit() {
    this.expandNodes(this.directory);
  }

  expandNodes(nodes: DocumentDirectory[]): void{
    if (nodes) {
      nodes.forEach(node => {
        if (node.expanded) {
          this.treeControl.expand(node);
          this.expandNodes(node.children);
        }});
    }
  }

  ngOnInit(): void {
    this.api.getDocumentDirectory(this.study.id, null, true).subscribe(dd => {
      this.dataSource.data = dd;
    });
  }

  public downloadFile(fileMeta: FileMeta): void {
    this.api.getFileData(fileMeta.id).subscribe(response => {
      // It is necessary to create a new response object with mime-type explicitly set
      // otherwise only Chrome works like it should
      const newBlob = new Blob([response.body], {type: fileMeta.content_type});

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
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    });
  }

}
