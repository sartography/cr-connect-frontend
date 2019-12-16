import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFormOptions} from '@ngx-formly/core';
import {Study} from '../_models/study';
import {WorkflowProcess} from '../_models/workflow';

@Component({
  selector: 'app-workflow-process',
  templateUrl: './workflow-process.component.html',
  styleUrls: ['./workflow-process.component.scss']
})
export class WorkflowProcessComponent implements OnInit {
  @Input() study: Study;
  @Input() process: WorkflowProcess;
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: any = {};

  constructor() {
  }

  ngOnInit() {
  }

}
