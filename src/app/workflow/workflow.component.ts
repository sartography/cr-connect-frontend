import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, Workflow, WorkflowTask, WorkflowTaskState, WorkflowTaskType} from 'sartography-workflow-lib';
import {FileMeta} from 'sartography-workflow-lib/lib/types/file';
import {
  WorkflowResetDialogComponent,
  WorkflowResetDialogData
} from '../workflow-reset-dialog/workflow-reset-dialog.component';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {
  workflow: Workflow;
  currentTask: WorkflowTask;
  studyId: number;
  workflowId: number;
  taskTypes = WorkflowTaskType;
  displayData = (localStorage.getItem('displayData') === 'true');
  displayFiles = (localStorage.getItem('displayFiles') === 'true');
  fileMetas: FileMeta[];
  loading = true;
  error: object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private location: Location,
  ) {
    this.loading = true;
    this.route.paramMap.subscribe(paramMap => {
      this.studyId = parseInt(paramMap.get('study_id'), 10);
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
    });
  }

  get numFiles(): number {
    return this.fileMetas ? this.fileMetas.length : 0;
  };

  ngOnInit(): void {
    this.api.getWorkflow(this.workflowId).subscribe(
      wf => {
        this.workflow = wf;
      },
      error => {
        this.handleError(error)
      },
      () => {
        this.updateTaskList(this.workflow);
      }
    );
  }

  handleError(error): void {
    this.error = error;
    this.currentTask = null;
    console.log('Encountered an error:' + error);
  }

  setCurrentTask(taskId: string) {
    this.loading = true;
    this.api.setCurrentTaskForWorkflow(this.workflowId, taskId).subscribe(wf => {
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
    this.workflow = wf;
    this.currentTask = undefined;
    this.updateTaskList(this.workflow);
  }

  hasIncompleteUserTask() {
    if (this.workflow.navigation && (this.workflow.navigation.length > 0)) {
      const incompleteStates = [
        WorkflowTaskState.READY,
        WorkflowTaskState.FUTURE,
        WorkflowTaskState.WAITING,
        WorkflowTaskState.LIKELY,
      ];
      const incompleteTasks = this.workflow.navigation.filter(t => incompleteStates.includes(t.state));
      return this.currentTask &&
        (this.currentTask.type === WorkflowTaskType.USER_TASK) &&
        (incompleteTasks.length > 0);
    } else {
      return false;
    }
  }

  toggleDataDisplay(show?: boolean) {
    this.displayData = show !== undefined ? show : !this.displayData;
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

  resetWorkflow() {
    this.api.getWorkflow(this.workflowId, {hard_reset: true}).subscribe((workflow) => {
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
    const dialogRef = this.dialog.open(WorkflowResetDialogComponent, {data});

    dialogRef.afterClosed().subscribe((dialogData: WorkflowResetDialogData) => {
      if (dialogData && dialogData.confirm) {
        this.resetWorkflow();
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

  private updateTaskList(wf: Workflow, forceTaskId?: string) {
    this.loading = true;
    this.api.listWorkflowFiles(wf.id).subscribe(fms => {
      this.fileMetas = fms;
    });

    // The current task will be set by the backend, unless specifically forced.
    if (forceTaskId) {
      const navItem = this.workflow.navigation.filter(t => t.task_id === forceTaskId)[0];

      // If it's a valid task and not the current workflow task,
      // reset the token to the selected task.
      if (navItem && navItem.task && (forceTaskId !== wf.next_task.id)) {
        this.setCurrentTask(forceTaskId);
      } else {
        // The given task ID is no longer part of this workflow.
        // Just set the current task to the workflow's next task.
        this.currentTask = wf.next_task;
      }
    } else {
      this.currentTask = wf.next_task;
    }
    console.log('Udate Task Executed', this.currentTask);
    this.logTaskData(this.currentTask);
    this.updateUrl();
    this.loading = false;
  }
}
