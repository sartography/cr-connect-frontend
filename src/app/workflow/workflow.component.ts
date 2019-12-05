import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Study} from '../_models/study';
import {StudyTask} from '../_models/study-task';
import {StudyType} from '../_models/study-type';
import {Task} from '../_models/task';
import {WorkflowProcess} from '../_models/workflow';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  process: WorkflowProcess;

  constructor(private api: ApiService) {
    this.subs.push(this.api.getWorkflowProcess(0).subscribe(p => this.process = p));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
