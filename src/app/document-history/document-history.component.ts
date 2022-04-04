import {Component, Input, OnInit} from '@angular/core';
import {ApiService, DocumentDirectory, Study, FileMeta} from 'sartography-workflow-lib';
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";
@Component({
  selector: 'app-document-history',
  templateUrl: './document-history.component.html',
  styleUrls: ['./document-history.component.scss']
})
export class DocumentHistoryComponent implements OnInit {
  @Input() study: Study;
  dataDictionary: DocumentDirectory[];
  columnsToDisplay = ['category', 'child'];
  secondLevelColumns = ['category']
  noColumns = []


  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getDocumentDirectory(this.study.id, null).subscribe(dd => {
      this.dataDictionary = dd;
    });
  }

}
