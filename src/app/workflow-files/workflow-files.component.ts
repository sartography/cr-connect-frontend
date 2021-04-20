import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService, DocumentDirectory, FileMeta, Study, Workflow} from 'sartography-workflow-lib';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';


@Component({
  selector: 'app-workflow-files',
  templateUrl: './workflow-files.component.html',
  styleUrls: ['./workflow-files.component.scss']
})

export class WorkflowFilesComponent implements OnInit,OnChanges,AfterViewInit {
  @Input() workflow?: Workflow;
  @Input() study?: Study;
//  @Input() fileMetas: FileMeta[];
  @Input() directory: DocumentDirectory[];
  typeLabel: string;
  treeControl = new NestedTreeControl<DocumentDirectory>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DocumentDirectory>();
  constructor(private api: ApiService) {
  }

  ngOnChanges(changes: SimpleChanges){
    this.dataSource.data = this.directory;
    this.treeControl.dataNodes = this.directory;
    setTimeout(()=>this.expandNodes(this.directory), 10);
  }

  hasChild = (_: number, node: DocumentDirectory) => node.children.length > 0;

  ngAfterViewInit() {
    this.expandNodes(this.directory)
  }

  expandNodes(nodes: DocumentDirectory[]): void{
    nodes.forEach(node=>{
      if (node.expanded) {
        this.treeControl.expand(node);
        this.expandNodes(node.children);
      }});
  }

  ngOnInit(): void {
    this.typeLabel = this.workflow ? 'workflow' : (this.study ? 'study' : 'context');
    this.dataSource.data = this.directory;
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
