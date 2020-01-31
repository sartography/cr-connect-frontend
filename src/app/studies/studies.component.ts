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

  constructor(private api: ApiService) {
    this.loadStudies();
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

  addStudy() {
    const study = newRandomStudy();
    console.log('study', study);
    this.api.addStudy(study).subscribe(() => this.loadStudies());
  }
}
