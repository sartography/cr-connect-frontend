import {Component, Inject, OnInit, ViewChild} from '@angular/core';
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
import {ActivatedRoute} from '@angular/router';

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
export class ApprovalsComponent implements OnInit {
  approvalsByStatus: ApprovalsByStatus[] = [];
  loading = true;
  asUser = null;
  USER_ARG = 'as_user';

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private api: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.asUser = params.get(this.USER_ARG);
      console.log('as user', params);
      this.loadApprovals(this.asUser);
    })
  }

  groupApprovalsByStatus(approvals: Approval[]) {
    const statusKeys = Object.keys(ApprovalStatus).filter(k => k !== ApprovalStatus.CANCELED.toString());
    return statusKeys.map((statusKey, i) => {
      const filtered = approvals.filter(s => s.status.toLowerCase() === statusKey.toLowerCase());
      return {
        status: ApprovalStatus[statusKey],
        statusLabel: ApprovalStatusLabels[statusKey],
        approvals: filtered,
        dataSource: new MatTableDataSource(filtered),
      };
    });
  }

  loadApprovals(asUser: string) {
    this.api.getApprovals(false, asUser).subscribe(approvals => {
      this.approvalsByStatus = this.groupApprovalsByStatus(approvals);
      this.loading = false;
    });
  }
}
