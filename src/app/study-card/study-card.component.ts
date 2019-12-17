import {Component, Input, OnInit} from '@angular/core';
import {Study} from '../_models/study';

@Component({
  selector: 'app-study-card',
  templateUrl: './study-card.component.html',
  styleUrls: ['./study-card.component.scss']
})
export class StudyCardComponent implements OnInit {
  @Input() study: Study;

  constructor() { }

  ngOnInit() {
  }

}
