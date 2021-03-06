
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

import {
  ApiService,
  AppEnvironment,
  scrollToTop,
  Workflow, WorkflowNavItem,
  WorkflowTask,
  WorkflowTaskState,
  WorkflowTaskType,
} from 'sartography-workflow-lib';
import { FileMeta } from 'sartography-workflow-lib/lib/types/file';
import {
  WorkflowResetDialogComponent,
  WorkflowResetDialogData
} from '../workflow-reset-dialog/workflow-reset-dialog.component';
import {WorkflowNavComponent} from '../workflow-nav/workflow-nav.component';
import {isOrContainsUserTasks} from '../_util/nav-item';


@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})

export class WorkflowComponent implements OnInit {
  workflow: Workflow;
  currentTask: WorkflowTask;
  studyId: number;
  showDataPane: boolean;
  workflowId: number;
  taskTypes = WorkflowTaskType;
  displayData = (localStorage.getItem('displayData') === 'true');
  displayFiles = (localStorage.getItem('displayFiles') === 'true');
  fileMetas: FileMeta[];
  loading = true;
  isAdmin: boolean;
  error: object;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private location: Location,
    private deviceDetector: DeviceDetectorService,
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.studyId = parseInt(paramMap.get('study_id'), 10);
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);

    });
  }

  get numFiles(): number {
    return this.fileMetas ? this.fileMetas.length : 0;
  };

  ngOnInit(): void {
    // fixme: We should have a central user service, not lots of distinct calls.
    const impersonateUid = localStorage.getItem('admin_view_as');
    this.api.getUser(impersonateUid || undefined).subscribe(u => {
      this.isAdmin = u.is_admin;
      this.showDataPane = (!this.environment.hideDataPane) || (this.isAdmin);

      this.api.getWorkflow(this.workflowId).subscribe(
        wf => {
          console.log('ngOnInit workflow', wf);
          this.workflow = wf;
        },
        error => {
          this.handleError(error)
        },
        () => {
          this.updateTaskList(this.workflow);
        }
      );
    });
  }

  handleError(error): void {
    this.error = error;
    this.currentTask = null;
    console.log('Encountered an error:' + error);
  }

  setCurrentTask(taskId: string) {
    this.loading = true;
    this.api.setCurrentTaskForWorkflow(this.workflowId, taskId).subscribe(wf => {
      console.log('setCurrentTask workflow', wf);
      this.workflow = wf;
      this.currentTask = wf.next_task;
      this.updateUrl();
      this.loading = false;
    });
  }

  updateUrl() {
    if (this.currentTask) {
      window.history.replaceState({}, '',
        `study/${this.studyId}/workflow/${this.workflowId}/task/${this.currentTask.id}`);
    }
  }

  completeManualTask(task: WorkflowTask) {
    this.api.updateTaskDataForWorkflow(this.workflow.id, task.id, {}).subscribe(
      updatedWorkflow => {
        console.log('completeManualTask workflow', updatedWorkflow);
        this.workflowUpdated(updatedWorkflow);
      }
    );
  }

  logTaskData(task) {
    if (task) {
      const label = `Data for Workflow Task: '${task.name} (${task.id})'`;
      console.group(label);
      console.table(Object.entries(task.data).map(e => {
        return {
          'Form Field Name': e[0],
          'Stored Value': e[1]
        };
      }));
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
    this.updateTaskList(this.workflow);
  }

  incompleteTasks(): WorkflowNavItem[]{
    if (this.workflow.navigation && (this.workflow.navigation.length > 0)) {
      const incompleteStates = [
        WorkflowTaskState.READY,
        WorkflowTaskState.FUTURE,
        WorkflowTaskState.WAITING,
        WorkflowTaskState.LIKELY,
      ];
      const incompleteTasks = this.workflow.navigation.filter(t => incompleteStates.includes(t.state));
      return incompleteTasks;
    }
    return [];
}

  isOnlyTask(): boolean{
    const userTasks = this.workflow.navigation.filter(t => isOrContainsUserTasks(t))
    return userTasks.length === 1;
  }

  hasIncompleteUserTask() {
    const incompleteTasks = this.incompleteTasks();
    if (incompleteTasks.length > 0){
      return this.currentTask &&
        (this.currentTask.type === WorkflowTaskType.USER_TASK) &&
        ((this.currentTask.state === WorkflowTaskState.READY) || (incompleteTasks.length > 0));
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

  resetWorkflow(clearData: boolean = false) {
   this.api.restartWorkflow(this.workflowId, clearData).subscribe(workflow => {
      console.log('resetWorkflow workflow', workflow);
      this.snackBar.open(`Your workflow has been reset successfully.`, 'Ok', {duration: 3000});
      this.workflow = workflow;
      this.updateTaskList(workflow);
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
        this.resetWorkflow(dialogData.clearData);
      }
    });
  }

  closePane() {
    this.toggleFilesDisplay(false);
    this.toggleDataDisplay(false);
  }

  goBack() {
    this.location.back();
  }

  countdown() {
    setInterval(() => {
      this.workflow.redirect--;
    }, 1000);
  }

  isLocked(currentTask: WorkflowTask): boolean {
    return currentTask.state === WorkflowTaskState.LOCKED;
  }

  private updateTaskList(wf: Workflow, forceTaskId?: string) {
    this.loading = true;
    this.workflow = wf;
    this.api.listWorkflowFiles(wf.id).subscribe(fms => {
      this.fileMetas = fms;
    });

    // The current task will be set by the backend, unless specifically forced.
    if (forceTaskId) {
      const navItem = this.workflow.navigation.filter(t => t.task_id === forceTaskId)[0];

      // If it's a valid task and not the current workflow task,
      // reset the token to the selected task.
      if (navItem && (forceTaskId !== wf.next_task.id)) {
        this.setCurrentTask(forceTaskId);
      } else {
        // The given task ID is no longer part of this workflow.
        // Just set the current task to the workflow's next task.
        this.currentTask = wf.next_task;
      }
    } else {
      this.currentTask = wf.next_task;
    }
    console.log('Update Task Executed', this.currentTask);

    this.logTaskData(this.currentTask);
    this.updateUrl();
    scrollToTop(this.deviceDetector);
    this.loading = false;
  }
}
