import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFormOptions} from '@ngx-formly/core';
import {Study} from '../_models/study';
import {WorkflowProcess} from '../_models/workflow';

@Component({
  selector: 'app-workflow-process',
  templateUrl: './workflow-process.component.html',
  styleUrls: ['./workflow-process.component.scss']
})
export class WorkflowProcessComponent implements OnInit {
  @Input() study: Study;
  @Input() process: WorkflowProcess;
  form = new FormGroup({});
  options: FormlyFormOptions = {
    formState: {
      selectOptionsData: {
        teams: [
          {id: '1', name: 'Bayern Munich', sportId: '1'},
          {id: '2', name: 'Real Madrid', sportId: '1'},
          {id: '3', name: 'Cleveland', sportId: '2'},
          {id: '4', name: 'Miami', sportId: '2'},
        ],
        players: [
          {id: '1', name: 'Bayern Munich (Player 1)', teamId: '1'},
          {id: '2', name: 'Bayern Munich (Player 2)', teamId: '1'},
          {id: '3', name: 'Real Madrid (Player 1)', teamId: '2'},
          {id: '4', name: 'Real Madrid (Player 2)', teamId: '2'},
          {id: '5', name: 'Cleveland (Player 1)', teamId: '3'},
          {id: '6', name: 'Cleveland (Player 2)', teamId: '3'},
          {id: '7', name: 'Miami (Player 1)', teamId: '4'},
          {id: '8', name: 'Miami (Player 2)', teamId: '4'},
        ],
      },
    },
  };
  model;

  constructor() {
  }

  ngOnInit() {
  }

}
