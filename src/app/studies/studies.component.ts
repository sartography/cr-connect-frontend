import {Component, Inject} from '@angular/core';
import {ApiService, AppEnvironment, ProtocolBuilderStatus, Study} from 'sartography-workflow-lib';


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
  beforeStudyIds: number[] = [];
  afterStudyIds: number[] = [];
  studiesByStatus: StudiesByStatus[] = [];
  irbUrl: string;
  newStudy: Study;
  inactiveStudies: Study[];
  loading = true;

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private api: ApiService,
  ) {
    this.irbUrl = environment.irbUrl;
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
      if (this.beforeStudyIds.length === 0) {
        this.beforeStudyIds = this.afterStudyIds;
      }

      const statuses = Object.keys(ProtocolBuilderStatus);
      this.studiesByStatus = statuses.map((status, i) => {
        return {
          status: ProtocolBuilderStatus[status],
          statusLabel: status,
          studies: sorted.filter(s => !s.inactive && (s.protocol_builder_status === ProtocolBuilderStatus[status])),
        };
      });
      this.inactiveStudies = sorted.filter(s => s.inactive);
      this.loading = false;
    });
  }

  openProtocolBuilder() {
    window.open(this.irbUrl, '_blank');
  }

  isNewStudy(studyId: number) {
    return !this.beforeStudyIds.includes(studyId);
  }
}
