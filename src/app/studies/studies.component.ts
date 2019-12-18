import {Component, OnInit} from '@angular/core';
import {ProtocolBuilderStatus, Study} from '../_models/study';
import {ApiService} from '../_services/api/api.service';

export interface StudiesByStatus {
  status: ProtocolBuilderStatus;
  statusLabel: string;
  studies: Study[];
}

@Component({
  selector: 'app-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {
  studiesByStatus: StudiesByStatus[] = [];
  isExpanded: boolean;

  constructor(private api: ApiService) {
    this.loadStudies();
  }

  ngOnInit() {
  }

  loadStudies() {
    this.api.getStudies().subscribe(allStudies => {
      const statuses = Object.keys(ProtocolBuilderStatus);
      this.studiesByStatus = statuses.map((status, i) => {
        return {
          status: ProtocolBuilderStatus[status],
          statusLabel: status,
          studies: allStudies.filter(s => s.protocol_builder_status === ProtocolBuilderStatus[status]),
        };
      });
    });
  }

  changeNumStudies(amt: number) {
    const numStudies = parseInt(localStorage.getItem('numstudy') || '0', 10);
    const newVal = Math.max(0, numStudies + amt);
    localStorage.setItem('numstudy', `${newVal}`);
    this.loadStudies();
  }
}
