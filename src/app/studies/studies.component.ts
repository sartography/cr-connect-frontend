import {Component, Inject, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {
  ApiService,
  AppEnvironment,
  ProtocolBuilderStatus,
  ProtocolBuilderStatusLabels,
  Study
} from 'sartography-workflow-lib';


export interface StudiesByStatus {
  status: ProtocolBuilderStatus;
  statusLabel: string;
  studies: Study[];
  dataSource: MatTableDataSource<Study>;
}

@Component({
  selector: 'app-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {
  beforeStudyIds: number[];
  afterStudyIds: number[];
  studiesByStatus: StudiesByStatus[] = [];
  irbUrl: string;
  loading = true;
  view = 'dashboard';

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private api: ApiService,
  ) {
    this.irbUrl = environment.irbUrl;
  }


  ngOnInit(): void {
    this.loadStudies();
  }

  loadStudies() {
    this.api.getStudies().subscribe(allStudies => {
      const sorted = allStudies.sort((a, b) => {
        const aTime = new Date(a.last_updated).getTime();
        const bTime = new Date(b.last_updated).getTime();
        return bTime - aTime;
      });

      // Save the previous set of ids
      this.beforeStudyIds = this.afterStudyIds;

      // New studies
      this.afterStudyIds = sorted.map(s => s.id);

      // Don't mark all the studies as new if this is the first time loading studies
      if (this.beforeStudyIds === undefined) {
        this.beforeStudyIds = this.afterStudyIds;
      }

      const statusKeys = Object.keys(ProtocolBuilderStatus);
      this.studiesByStatus = statusKeys.map((statusKey, i) => {
        const filtered = sorted.filter(s => s.protocol_builder_status.toLowerCase() === statusKey.toLowerCase());
        return {
          status: ProtocolBuilderStatus[statusKey],
          statusLabel: ProtocolBuilderStatusLabels[statusKey],
          studies: filtered,
          dataSource: new MatTableDataSource(filtered),
        };
      });

      this.loading = false;
    });
  }

  updateStudies($event: Study) {
    this.loadStudies();
  }
}
