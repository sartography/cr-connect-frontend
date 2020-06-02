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
  myApprovalsByStatus: ApprovalsByStatus[] = [];
  allApprovalsByStatus: ApprovalsByStatus[] = [];
  loading = true;

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private api: ApiService,
    private httpClient: HttpClient
  ) {
    this.loadApprovals();
  }

  organized_approvals(approvals: Approval[], all: boolean) {
    const statusKeys = Object.keys(ApprovalStatus);
    const organizedApprovals = statusKeys.map((statusKey, i) => {
      const filtered = approvals.filter(s => s.status.toLowerCase() === statusKey.toLowerCase());
      return {
        status: ApprovalStatus[statusKey],
        statusLabel: ApprovalStatusLabels[statusKey],
        approvals: filtered,
        dataSource: new MatTableDataSource(filtered),
      };
    });
    return organizedApprovals;
  }

  loadApprovals() {
    this.api.getApprovals(false).subscribe(approvals => {
      this.myApprovalsByStatus = this.organized_approvals(approvals, false);
      this.loading = false;
    });
    this.api.getApprovals(false).subscribe(approvals => {
      this.allApprovalsByStatus = this.organized_approvals(approvals, false);
      this.loading = false;
    });

  }
}
