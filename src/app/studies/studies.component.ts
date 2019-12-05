import {Component, OnInit} from '@angular/core';
import {Study, StudyStatus} from '../_models/study';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {
  draftStudies: Study[] = [];
  submittedStudies: Study[] = [];
  activeStudies: Study[] = [];
  inactiveStudies: Study[] = [];

  constructor(private api: ApiService) {
    this.api.getStudies().subscribe(allStudies => {
      allStudies.forEach(s => {
        this[s.status + 'Studies'].push(s);
      });
    });
  }

  ngOnInit() {
  }

}
