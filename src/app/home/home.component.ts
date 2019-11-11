import {Component, OnInit} from '@angular/core';
import {Study} from '../_models/study';
import {StudyType} from '../_models/study_type';
import {Task} from '../_models/task';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  study: Study;
  tasks: Task[];
  types: StudyType[];
  selectedType: string;

  constructor(private api: ApiService) {
    this.api.getStudyTypes().subscribe(st => this.types = st);
    this.api.getTasks().subscribe(t => this.tasks = t);
  }

  ngOnInit() {

  }
}
