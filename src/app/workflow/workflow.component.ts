
import { Location } from '@angular/common';
import {Component, ElementRef, Inject, NgZone, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import {shrink} from '../_util/shrink'
import {
  ApiService,
  AppEnvironment, DocumentDirectory,
  scrollToTop, Study, UserService,
  Workflow, WorkflowNavItem,
  WorkflowTask,
  WorkflowTaskState,
  WorkflowTaskType,
} from 'sartography-workflow-lib';

import {
  WorkflowResetDialogComponent,
  WorkflowResetDialogData
} from '../workflow-reset-dialog/workflow-reset-dialog.component';
import {isOrContainsUserTasks} from '../_util/nav-item';
import {UserPreferencesService} from '../user-preferences.service';
import { WorkflowDialogComponent } from '../workflow-dialog/workflow-dialog.component';


@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})

export class WorkflowComponent implements OnInit {
  workflow: Workflow;
  currentTask: WorkflowTask = null;
  studyId: number;
  studyName: string;
  study : Study;
  showDataPane: boolean;
  showAdminTools: boolean;
  workflowId: number;
  taskTypes = WorkflowTaskType;
  displayData = (localStorage.getItem('displayData') === 'true');
  displayFiles = (localStorage.getItem('displayFiles') === 'true');
  // fileMetas: FileMeta[];
  dataDictionary: DocumentDirectory[];
  loading = true;
  shrink = shrink;
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
    private userService: UserService,
    private userPreferencesService: UserPreferencesService,
    private ngZone: NgZone,
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
      this.api.getWorkflow(this.workflowId).subscribe(
        wf => {
          this.workflow = wf;
          console.log('ngOnInit workflow', this.workflow);
          console.log(this.workflow);
          if (this.workflow.study_id != null) {
            console.log('Fetching Study Information...')
            this.api.getStudy(this.workflow.study_id).subscribe(res => {
              res.id = this.workflow.study_id;
              this.study = res;
              console.log(this.study);
            });
          }
        },
        error => {
          this.handleError(error)
        },
        () => this.updateTaskList(this.workflow)
      );

    });
    this.userService.isAdmin$.subscribe(a => {this.isAdmin = a;
      this.showDataPane = (!this.environment.hideDataPane) || (this.isAdmin);})
    this.userPreferencesService.preferences$.subscribe(p => {
      this.environment.hideDataPane = !p.showAdminTools
      this.showDataPane = (!this.environment.hideDataPane) || (this.isAdmin);
      this.showAdminTools = p.showAdminTools;
    });
  }

  get numFiles(): number {
    return this.dataDictionary ? this.dataDictionary.length : 0;
  };

  ngOnInit(): void {
    window[`angularComponentReference`] = {
      component: this, zone: this.ngZone, loadAngularFunction: (str: string) => {
        return this.angularFunctionCalled(str);
      }
    };

  }

  openDialog(id: string) {
    const element = document.getElementById(id);
    let markdown = 'No information found for this footnote.';
    if(element != null) {
      markdown = element.getAttribute('value');
    }

    this.dialog.open(WorkflowDialogComponent, {
      data: markdown,
      maxWidth: '600px',
      autoFocus: true
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
        `workflow/${this.workflowId}/task/${this.currentTask.id}`);
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
      return this.workflow.navigation.filter(t => incompleteStates.includes(t.state));
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

  resetWorkflow(clearData: boolean = false, deleteFiles = false) {
   this.api.restartWorkflow(this.workflowId, clearData, deleteFiles).subscribe(workflow => {
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
        this.resetWorkflow(dialogData.clearData, dialogData.deleteFiles);
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
    if (this.workflow.study_id != null) {
      this.api.getDocumentDirectory(this.workflow.study_id, this.workflowId).subscribe(dd => {
        this.dataDictionary = dd;
      })
    }

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
