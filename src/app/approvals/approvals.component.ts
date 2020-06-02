import {Component, Inject, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {
  ApiService,
  AppEnvironment,
  Approval,
  ApprovalStatus,
  ApprovalStatusLabels
} from 'sartography-workflow-lib';

export interface ApprovalsByStatus {
  status: ApprovalStatus;
  statusLabel: string;
  approvals: Approval[];
  dataSource: MatTableDataSource<Approval>;
}

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent {
  approvalsByStatus: ApprovalsByStatus[] = [];
  loading = true;

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private api: ApiService,
    private httpClient: HttpClient
  ) {
    this.loadApprovals();
  }

  loadApprovals() {
    this.api.getApprovals().subscribe(allApprovals => {
      // const sorted = allStudies.sort((a, b) => {
      //   const aTime = new Date(a.last_updated).getTime();
      //   const bTime = new Date(b.last_updated).getTime();
      //   return bTime - aTime;
      // });


      const statusKeys = Object.keys(ApprovalStatus);
      this.approvalsByStatus = statusKeys.map((statusKey, i) => {
        const filtered = allApprovals.filter(s => s.status.toLowerCase() === statusKey.toLowerCase());
        return {
          status: ApprovalStatus[statusKey],
          statusLabel: ApprovalStatusLabels[statusKey],
          approvals: filtered,
          dataSource: new MatTableDataSource(filtered),
        };
      });

      this.loading = false;
    });
  }
}
