import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFormOptions} from '@ngx-formly/core';
import {Study} from '../_models/study';
import {Workflow} from '../_models/workflow';
import {WorkflowTask} from '../_models/workflow-task';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})
export class WorkflowFormComponent implements OnInit {
  @Input() study: Study;
  @Input() workflowTasks: WorkflowTask[];
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: any = {};

  constructor() {
  }

  ngOnInit() {
    console.log('workflowTasks', this.workflowTasks);
  }

}
