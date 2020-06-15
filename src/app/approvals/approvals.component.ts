import {Component, Inject, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {
  ApiService,
  AppEnvironment,
  Approval,
  ApprovalCounts,
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
export class ApprovalsComponent implements OnInit {
  approvalsByStatus: ApprovalsByStatus;
  selectedStatus = ApprovalStatus.PENDING;
  countsLoading = true;
  loading = true;
  asUser = null;
  USER_ARG = 'as_user';
  statuses = ApprovalStatus;
  statusLabels = ApprovalStatusLabels;
  statusKeys = Object.keys(ApprovalStatus).filter(k => k !== ApprovalStatus.CANCELED.toString());
  statusCounts: ApprovalCounts;

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private api: ApiService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.asUser = params.get(this.USER_ARG);
      console.log('as user', params);
      this.loadApprovals(this.asUser);
    })
  }

  loadApprovals(asUser: string) {
    this.loading = true;

    this.api.getApprovalCounts(this.asUser).subscribe(sc => {
      this.countsLoading = false;
      this.statusCounts = sc;
    });

    this.api.getApprovals(this.selectedStatus, asUser).subscribe(approvalByStatus => {
      this.approvalsByStatus = {
        status: this.selectedStatus,
        statusLabel: ApprovalStatusLabels[this.selectedStatus.toString()],
        approvals: approvalByStatus,
        dataSource: new MatTableDataSource(approvalByStatus),
      }
      this.loading = false;
    });
  }

  onOpen(statusKey: string) {
    if (statusKey !== this.selectedStatus.toString()) {
      this.selectedStatus = this.statuses[statusKey];
      this.loadApprovals(this.asUser);
    }
  }
}
