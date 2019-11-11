import {Component, OnInit} from '@angular/core';
import {Study} from '../_models/study';
import {Task} from '../_models/task';
import {ApiService} from '../_services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  study: Study;
  tasks: Task[];

  constructor(private api: ApiService) {
  }

  ngOnInit() {
  }

  showInfo(task: Task) {

  }
}
