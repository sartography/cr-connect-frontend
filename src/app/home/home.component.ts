import {Component, OnInit} from '@angular/core';
import {Study} from '../_models/study';
import {StudyTask} from '../_models/study-task';
import {StudyType} from '../_models/study-type';
import {Task} from '../_models/task';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  studies: Study[] = [];
  tasks: Task[] = [];
  types: StudyType[] = [];
  studyTasks: StudyTask[] = [];
  selectedType: StudyType;
  selectedStudy: Study;

  constructor(private api: ApiService) {
    this.api.getStudies().subscribe(s => this.studies = s);
    this.api.getStudyTypes().subscribe(st => this.types = st);
  }

  ngOnInit() {
  }

  getStudyTasks(study: Study) {
    this.selectedStudy = study;
    this.tasks = [];

    this.api.getStudyTasksForStudy(this.selectedStudy.id).subscribe(st => {
      this.studyTasks = st;
      st.forEach(item => {
        this.api.getTask(item.task_id).subscribe(t => {
          this.tasks.push(t);
        });
      });
    });
  }

  isDisabled(task: Task) {
    return this.studyTasks.find(st => st.task_id === task.id).is_disabled;
  }

  isComplete(task: Task) {
    return this.studyTasks.find(st => st.task_id === task.id).is_complete;
  }
}
