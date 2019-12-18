import {Component, Input, OnInit} from '@angular/core';
import {ChartType} from 'chart.js';
import {Color, Label, MultiDataSet} from 'ng2-charts';
import {Study} from '../_models/study';

interface ChartData {
  title: string;
  labels: Label[];
  data: MultiDataSet;
  type: ChartType;
  colors: Color[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() study: Study;
  colors: Color[] = [{
    backgroundColor: [
      '#E57200', // orange
      '#5266a5', // light blue
      '#232D4B', // dark blue
    ]
  }];
  labels: Label[] = ['Incomplete', 'Partially Complete', 'Complete'];
  charts: ChartData[] = Array(6).fill({}).map((_, i) => {
    return {
      title: `Process Category ${i + 1}`,
      labels: this.labels,
      data: [this.randomInts(this.labels.length)],
      type: 'pie',
      colors: this.colors
    };
  });

  constructor() {
  }

  ngOnInit() {
  }

  randomInts(len: number): number[] {
    let remaining = 100;
    const arr = [];
    for (let i = 0; i < len; i++) {
      const newNum = this.getRandomInt(0, remaining);
      arr.push(newNum);
      remaining -= newNum;
    }

    return arr;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
