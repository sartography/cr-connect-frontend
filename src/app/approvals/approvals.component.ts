import {Component, Inject} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ApiService, AppEnvironment, Approval, ApprovalStatus, ApprovalStatusLabels} from 'sartography-workflow-lib';

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
  ) {
    this.loadApprovals();
  }

  groupApprovalsByStatus(approvals: Approval[]) {
    const statusKeys = Object.keys(ApprovalStatus).filter(k => k !== ApprovalStatus.CANCELED.toString());
    console.log('statusKeys', statusKeys);
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

  loadApprovals() {
    this.loading = true;
    this.api.getApprovals(false).subscribe(approvals => {
      this.approvalsByStatus = this.groupApprovalsByStatus(approvals);
      this.loading = false;
    });
  }
}
