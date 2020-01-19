import {Component, Input, OnInit} from '@angular/core';
import {Study} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study-card',
  templateUrl: './study-card.component.html',
  styleUrls: ['./study-card.component.scss']
})
export class StudyCardComponent implements OnInit {
  @Input() study: Study;
  percentComplete: number;

  constructor() {
    this.percentComplete = this.calculatePercentComplete();
  }

  ngOnInit() {
  }

  // TODO: Calculate percent complete based on number of tasks in workflow.
  calculatePercentComplete() {
    // For now, just return a random number.
    return Math.floor(Math.random() * 100);
  }
}
