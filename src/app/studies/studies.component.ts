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
  isExpanded: boolean;

  constructor(private api: ApiService) {
    this.loadStudies();
  }

  ngOnInit() {
  }

  loadStudies() {
    this.api.getStudies().subscribe(allStudies => {
      this.draftStudies = [];
      this.submittedStudies = [];
      this.activeStudies = [];
      this.inactiveStudies = [];
      allStudies.forEach(s => {
        this[s.status + 'Studies'].push(s);
      });
    });
  }

  changeNumStudies(amt: number) {
    const numStudies = parseInt(localStorage.getItem('numstudy') || '0', 10);
    const newVal = Math.max(0, numStudies + amt)
    localStorage.setItem('numstudy', `${newVal}`);
    this.loadStudies();
  }
}
