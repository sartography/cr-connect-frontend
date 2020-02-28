import {Component, OnInit} from '@angular/core';
import {ApiService, newRandomStudy, ProtocolBuilderStatus, Study} from 'sartography-workflow-lib';
import {environment} from '../../environments/environment';

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
export class StudiesComponent {
  studiesByStatus: StudiesByStatus[] = [];
  isExpanded: boolean;
  irbUrl = environment.irbUrl;
  newStudy: Study;
  inactiveStudies: Study[];

  constructor(private api: ApiService) {
    this.loadStudies();
  }

  loadStudies() {
    this.api.getStudies().subscribe(allStudies => {
      const sorted = allStudies.sort((a, b) => {
        const aTime = new Date(a.last_updated).getTime();
        const bTime = new Date(b.last_updated).getTime();
        return bTime - aTime;
      });

      const statuses = Object.keys(ProtocolBuilderStatus);
      this.studiesByStatus = statuses.map((status, i) => {
        return {
          status: ProtocolBuilderStatus[status],
          statusLabel: status,
          studies: sorted.filter(s => !s.inactive && (s.protocol_builder_status === ProtocolBuilderStatus[status])),
        };
      });
      this.inactiveStudies = sorted.filter(s => s.inactive);
    });
  }

  addStudy() {
    const study = newRandomStudy();
    this.api.addStudy(study).subscribe(newStudy => {
      this.newStudy = newStudy;
      this.loadStudies();
    });
  }
}
