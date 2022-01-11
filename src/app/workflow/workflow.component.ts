import {Location, LocationStrategy} from '@angular/common';
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { shrink } from '../_util/shrink';
import {
  ApiService,
  AppEnvironment,
  DocumentDirectory,
  scrollToTop,
  Study,
  UserService,
  Workflow,
  WorkflowTask,
  WorkflowTaskState,
  WorkflowTaskType,
} from 'sartography-workflow-lib';

import {
  WorkflowResetDialogComponent,
  WorkflowResetDialogData,
} from '../workflow-reset-dialog/workflow-reset-dialog.component';
import { isOrContainsUserTasks } from '../_util/nav-item';
import { UserPreferencesService } from '../user-preferences.service';
import { WorkflowDialogComponent } from '../workflow-dialog/workflow-dialog.component';
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})

export class WorkflowComponent implements OnInit {
  workflow: Workflow;
  currentTask: WorkflowTask = null;
  study: Study;
  showDataPane: boolean;
  showAdminTools: boolean;
  workflowId: number;
  taskTypes = WorkflowTaskType;
  displayData = (localStorage.getItem('displayData') === 'true');
  displayFiles = (localStorage.getItem('displayFiles') === 'true');
  dataDictionary: DocumentDirectory[];
  loading = true;
  shrink = shrink;
  isAdmin: boolean;
  error: object;
  errCounter: 0;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private location: Location,
    private deviceDetector: DeviceDetectorService,
    private userService: UserService,
    private userPreferencesService: UserPreferencesService,
    private ngZone: NgZone,

  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
      let urlTaskId = paramMap.get('task_id');
      this.api.getWorkflow(this.workflowId).subscribe(
        wf => {
          this.workflow = wf;
          if (this.workflow.study_id != null) {
            this.api.getStudy(this.workflow.study_id).subscribe(res => {
              res.id = this.workflow.study_id;
              this.study = res;
            });
          }
        },
        error => {
          this.handleError(error);
        },
        () => this.loadCurrentTask(this.workflow, urlTaskId),
      );
    });
    this.userService.isAdmin$.subscribe(a => {
      this.isAdmin = a;
      this.showDataPane = (!this.environment.hideDataPane) || (this.isAdmin);
    });
    this.userPreferencesService.preferences$.subscribe(p => {
      this.environment.hideDataPane = !p.showAdminTools;
      this.showDataPane = (!this.environment.hideDataPane) || (this.isAdmin);
      this.showAdminTools = p.showAdminTools;
    });
  }

  get numFiles(): number {
    return this.study ? this.study.files.length : 0;
  };

  ngOnInit(): void {
    window[`angularComponentReference`] = {
      component: this, zone: this.ngZone, loadAngularFunction: (str: string) => this.angularFunctionCalled(str),
    };
  }

  openDialog(id: string) {
    const element = document.getElementById(id);
    let markdown = 'No information found for this footnote.';
    if (element != null) {
      markdown = element.getAttribute('value');
    }

    this.dialog.open(WorkflowDialogComponent, {
      data: markdown,
      maxWidth: '600px',
      autoFocus: true,
    });
  }


  angularFunctionCalled(mat: string) {
    this.openDialog(mat);
  }

  handleError(error): void {
    this.error = error;
    this.currentTask = null;
    console.log('Encountered an error:' + error);
  }

  navigateUrl() {
    if (this.currentTask) {
      this.router.navigate(['workflow', this.workflowId, "task", this.currentTask.id]);
    }
  }

  completeManualTask(task: WorkflowTask) {
    this.api.updateTaskDataForWorkflow(this.workflow.id, task.id, {}).subscribe(
      updatedWorkflow => {
        console.log('completeManualTask workflow', updatedWorkflow);
        this.workflowUpdated(updatedWorkflow);
      },
    );
  }

  logTaskData(task) {
    if (task) {
      const label = `Data for Workflow Task: '${task.name} (${task.id})'`;
      console.group(label);
      console.table(Object.entries(task.data).map(e => ({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Form Field Name': e[0], 'Stored Value': e[1],
      })));
      console.groupEnd();
      console.log('Task:', task);
    }
  }

  workflowUpdated(wf: Workflow) {
    console.log('workflowUpdated workflow', wf);
    this.workflow = wf;

    // If this is the end of the workflow, redirect to the study menu in 5 seconds
    if (
      this.workflow.next_task &&
      this.workflow.next_task.type === WorkflowTaskType.END_EVENT &&
      !this.workflow.next_task.documentation
    ) {
      const redirectSecs = 1;
      this.workflow.redirect = redirectSecs;
      setTimeout(() => this.location.back(), redirectSecs * 1000);

      // Start the countdown
      this.countdown();
    } else {
      delete this.workflow.redirect;
    }

    this.currentTask = undefined;
    this.changeCurrentTask(this.workflow);
  }

  isOnlyTask(): boolean {
    const userTasks = this.workflow.navigation.filter(t => isOrContainsUserTasks(t));
    return userTasks.length === 1;
  }

  hasIncompleteUserTask() {
    if (this.currentTask) {
      return this.currentTask.type === WorkflowTaskType.USER_TASK;
    } else {
      return false;
    }
  }

  toggleDataDisplay(show?: boolean) {
    if (this.showDataPane)
      this.displayData = show !== undefined ? show : !this.displayData;
    else
      this.displayData = false;
    localStorage.setItem('displayData', (!!this.displayData).toString());

    if (this.displayData && show === undefined) {
      this.toggleFilesDisplay(!this.displayData);
    }
  }

  toggleFilesDisplay(show?: boolean) {
    this.displayFiles = show !== undefined ? show : !this.displayFiles;
    localStorage.setItem('displayFiles', (!!this.displayFiles).toString());

    if (this.displayFiles && show === undefined) {
      this.toggleDataDisplay(!this.displayFiles);
    }
  }

  resetWorkflow(clearData: boolean = false, deleteFiles = false) {
    this.api.restartWorkflow(this.workflowId, clearData, deleteFiles).subscribe(workflow => {
      console.log('resetWorkflow workflow', workflow);
      this.snackBar.open(`Your workflow has been reset successfully.`, 'Ok', {duration: 3000});
      this.workflow = workflow;
      this.loadCurrentTask(workflow);
    });
  }

  confirmResetWorkflow() {
    const data: WorkflowResetDialogData = {
      workflowId: this.workflowId,
      name: this.workflow.title,
    };

    const config = new MatDialogConfig();
    config.maxWidth = '500px';
    config.data = data;

    const dialogRef = this.dialog.open(WorkflowResetDialogComponent, config);

    dialogRef.afterClosed().subscribe((dialogData: WorkflowResetDialogData) => {
      if (dialogData && dialogData.confirm) {
        this.resetWorkflow(dialogData.clearData, dialogData.deleteFiles);
      }
    });
  }

  closePane() {
    this.toggleFilesDisplay(false);
    this.toggleDataDisplay(false);
  }

  goBack() {
    if (this.study) {
      this.router.navigate(['study', this.study.id]);
    } else {
      this.router.navigate(['/']);
    }
  }

  countdown() {
    setInterval(() => {
      this.workflow.redirect--;
    }, 1000);
  }

  isLocked(currentTask: WorkflowTask): boolean {
    return currentTask.state === WorkflowTaskState.LOCKED;
  }

  // Manually set the current task (force it).
  setCurrentTask(taskId: string) {
    this.loading = true;
    this.api.setCurrentTaskForWorkflow(this.workflowId, taskId).subscribe(wf => {
      console.log('setCurrentTask workflow', wf);
      this.workflow = wf;
      this.currentTask = wf.next_task;
      this.navigateUrl();
      this.loading = false;
    },
      (error) => {
        this.errCounter++;
        if (this.errCounter < 2) {
          this.setCurrentTask(this.workflow.next_task.id)
        } else {
          this.handleError(error);
        }
      }
    );
  }

  // Change the current task.
  changeCurrentTask(wf: Workflow) {
    this.loading = true;
    this.workflow = wf;
    this.currentTask = wf.next_task;
    this.logTaskData(this.currentTask);
    scrollToTop(this.deviceDetector);
    this.loading = false;
    this.navigateUrl();
  }

  // Load the current task from an initial load.
  loadCurrentTask(wf: Workflow, forceTaskId?: string) {
    this.loading = true;
    this.workflow = wf;
    if (this.workflow.study_id != null) {
      this.api.getDocumentDirectory(this.workflow.study_id, this.workflowId).subscribe(dd => {
        this.dataDictionary = dd;
      });
    }
    // You are trying to forcibly move to some task
    if (forceTaskId) {
      console.log('trying to force task');
      if (forceTaskId !== wf.next_task.id) {
        this.setCurrentTask(forceTaskId);
      } else {
        this.changeCurrentTask(wf);
      }
      // You are loading into a task from init
    } else {
      this.changeCurrentTask(wf);
    }
  }
}
