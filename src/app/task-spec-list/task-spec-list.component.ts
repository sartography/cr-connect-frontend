import {Component, Input, OnInit} from '@angular/core';
import {TaskSpec} from '../_models/task';
import {WorkflowSpec} from '../_models/workflow';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-task-spec-list',
  templateUrl: './task-spec-list.component.html',
  styleUrls: ['./task-spec-list.component.scss']
})
export class TaskSpecListComponent implements OnInit {
  @Input() workflowSpec: WorkflowSpec;
  taskSpecs: TaskSpec[];

  constructor(private api: ApiService) {
    if (this.workflowSpec && this.workflowSpec.task_specs) {
      this.loadTaskSpecsForWorkflowSpec();
    }
  }

  ngOnInit() {
  }

  loadTaskSpecsForWorkflowSpec() {
    this.api.getTaskSpecsForWorkflowSpec(this.workflowSpec).subscribe(ts => this.taskSpecs = ts);
  }
}
