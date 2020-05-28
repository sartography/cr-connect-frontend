import {Component, Inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import {Approval, ApprovalStatus} from '../studies-rrp/studies-rrp.component';

import {
  ApiService,
  AppEnvironment
} from 'sartography-workflow-lib';

export interface DialogData {
  approval: Approval;
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
  styleUrls: ['./dialog-content-example-dialog.scss']
})
export class DialogContentExampleDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private api: ApiService,
    private httpClient: HttpClient) {}

  ngOnInit() {
    let matFix = document.getElementsByClassName('mat-form-field-infix')[0] as HTMLElement;
    matFix.style.paddingBottom = '2px';
  }

  approve(message: string) {
    let approval = this.data.approval;
    const url = this.environment.api + `/approval/${approval.id}`;
    approval.message = message ? message : 'Empty message';
    approval.status = ApprovalStatus['APPROVED'];
    return this.httpClient
        .put(url, approval)
        .subscribe(
        val => {
          console.log("PUT call successful value returned in body",
                      val);
        },
        response => {
            console.log("PUT call in error", response);
        },
        () => {
            console.log("The PUT observable is now completed.");
        }
    );
  }

  reject(message: string) {
    let approval = this.data.approval;
    const url = this.environment.api + `/approval/${approval.id}`;
    approval.message = message ? message : 'Empty message';
    approval.status = ApprovalStatus['DECLINED'];
    return this.httpClient
        .put(url, approval)
        .subscribe(
        val => {
          console.log("PUT call successful value returned in body",
                      val);
        },
        response => {
            console.log("PUT call in error", response);
        },
        () => {
            console.log("The PUT observable is now completed.");
        }
    );
  }
}