import {Component, Inject, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import {Approval, ApprovalStatus} from 'sartography-workflow-lib';

import {
  ApiService,
  AppEnvironment
} from 'sartography-workflow-lib';

export interface DialogData {
  approval: Approval;
}

@Component({
  selector: 'app-approval-files-dialog',
  templateUrl: 'app-approval-files-dialog.html',
  styleUrls: ['./app-approval-files-dialog.scss']
})
export class ApprovalFilesDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private api: ApiService,
    private httpClient: HttpClient) {}

  ngOnInit() {
    const matFix = document.getElementsByClassName('mat-form-field-infix')[0] as HTMLElement;
    matFix.style.paddingBottom = '2px';
  }

  approve(message: string) {
    const approval = this.data.approval;
    const url = this.environment.api + `/approval/${approval.id}`;
    approval.message = message ? message : 'Empty message';
    approval.status = ApprovalStatus.APPROVED;
    return this.httpClient
        .put(url, approval)
        .subscribe(
        val => {
          console.log('PUT call successful value returned in body',
                      val);
        },
        response => {
            console.log('PUT call in error', response);
        },
        () => {
            console.log('The PUT observable is now completed.');
        }
    );
  }

  reject(message: string) {
    const approval = this.data.approval;
    const url = this.environment.api + `/approval/${approval.id}`;
    approval.message = message ? message : 'Empty message';
    approval.status = ApprovalStatus.DECLINED;
    return this.httpClient
        .put(url, approval)
        .subscribe(
        val => {
          console.log('PUT call successful value returned in body',
                      val);
        },
        response => {
            console.log('PUT call in error', response);
        },
        () => {
            console.log('The PUT observable is now completed.');
        }
    );
  }
}