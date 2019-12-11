import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Study} from '../_models/study';
import {StudyTask} from '../_models/study-task';
import {StudyType} from '../_models/study-type';
import {Task} from '../_models/task';
import {WorkflowProcess} from '../_models/workflow';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  studies: Study[] = [];
  tasks: Task[] = [];
  types: StudyType[] = [];
  studyTasks: StudyTask[] = [];
  selectedStudy: Study;
  subs: Subscription[] = [];

  constructor(private api: ApiService) {
    this.subs.push(this.api.getStudies().subscribe(s => this.studies = s));
    this.subs.push(this.api.getStudyTypes().subscribe(st => this.types = st));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  loadStudyTasks(study: Study) {
    this.selectedStudy = study;
    this.tasks = [];
    this.subs.push(this.api.getStudyTasksForStudy(this.selectedStudy.id).subscribe(st => {
      this.studyTasks = st;
      this.loadTasksForStudyTasks();
    }));
  }

  loadTasksForStudyTasks() {
    for (const st of this.studyTasks) {
      this.subs.push(this.api.getTask(st.task_id).subscribe(t => {
        this.tasks.push(t);
      }));
    }
  }

  isDisabled(task: Task) {
    return this.studyTasks.find(st => st.task_id === task.id).is_disabled;
  }

  isComplete(task: Task) {
    return this.studyTasks.find(st => st.task_id === task.id).is_complete;
  }

  isSignedIn() {
    return !!localStorage.getItem('signedIn');
  }
}
