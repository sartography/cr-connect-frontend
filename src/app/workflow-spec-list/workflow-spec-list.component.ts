import { Component, OnInit } from '@angular/core';
import {WorkflowSpec} from '../_models/workflow';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-workflow-spec-list',
  templateUrl: './workflow-spec-list.component.html',
  styleUrls: ['./workflow-spec-list.component.scss']
})
export class WorkflowSpecListComponent implements OnInit {
  workflowSpecs: WorkflowSpec[];

  constructor(private api: ApiService) {
    this.loadWorkflowSpecs();
  }

  ngOnInit() {
  }

  loadWorkflowSpecs() {
    this.api.getWorkflowSpecs().subscribe(wf => this.workflowSpecs = wf);
  }
}
