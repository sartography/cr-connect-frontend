import { Component, Input, OnInit } from '@angular/core';
import {Study, WorkflowStatus} from 'sartography-workflow-lib';

@Component({
  selector: 'app-review-progress',
  templateUrl: './review-progress.component.html',
  styleUrls: ['./review-progress.component.scss']
})
export class ReviewProgressComponent implements OnInit {
  @Input() study: Study;
  numCompletedReviews: number;
  numTotalReviews: number;
  percentComplete: number;
  opacity : number;

  constructor() {
  }

  ngOnInit(): void {
    this.calculatePercentComplete();
  }

  calculatePercentComplete() {
    this.numCompletedReviews = 0;
    this.numTotalReviews = 0;
    this.percentComplete = 0;
    this.study.categories.forEach(cat => {
      cat.workflows.forEach(wf => {
        if (wf.is_review) {
          if (wf.status === WorkflowStatus.COMPLETE) {
            this.numCompletedReviews += 1;
          }
          this.numTotalReviews += 1;
        }
      });
    });

    this.opacity = .0;
    if (this.numCompletedReviews > 0) {
      this.opacity = this.numCompletedReviews / this.numTotalReviews;
      this.percentComplete = Math.floor(this.numCompletedReviews / this.numTotalReviews * 100);
    }
  }
}




