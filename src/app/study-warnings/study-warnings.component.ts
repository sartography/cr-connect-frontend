import {Component, Input, OnInit} from '@angular/core';
import {Study} from 'sartography-workflow-lib';

@Component({
  selector: 'app-study-warnings',
  templateUrl: './study-warnings.component.html',
  styleUrls: ['./study-warnings.component.scss']
})
export class StudyWarningsComponent {
  @Input() study: Study;
  displayedColumns: string[] = [
    'code',
    'message'
  ];

  constructor() { }

}
