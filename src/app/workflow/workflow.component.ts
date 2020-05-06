import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApiService,
  Workflow,
  WorkflowSpec,
  WorkflowTask,
  WorkflowTaskState,
  WorkflowTaskType
} from 'sartography-workflow-lib';
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
export class WorkflowComponent {
  workflow: Workflow;
  workflowSpec: WorkflowSpec;
  allTasks: WorkflowTask[];
  currentTask: WorkflowTask;
  studyId: number;
  workflowId: number;
  taskTypes = WorkflowTaskType;
  displayData = (localStorage.getItem('displayData') === 'true');
  displayFiles = false;
  fileMetas: FileMeta[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.studyId = parseInt(paramMap.get('study_id'), 10);
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
      this.updateTaskList(this.workflowId, paramMap.get('task_id'));
    });
  }

  get numFiles(): number {
    return this.fileMetas ? this.fileMetas.length : 0;
  };

  setCurrentTask(task: WorkflowTask) {
    console.log('setCurrentTask', task);
    this.currentTask = this._initTask(task);
    this.updateUrl();
  }

  updateUrl() {
    console.log('updateUrl', this.currentTask)
    if (this.currentTask) {
      window.history.replaceState({}, '',
        `study/${this.studyId}/workflow/${this.workflowId}/task/${this.currentTask.id}`);
    }

    // if (this.currentTask) {
    //   this.router.navigate(['study', this.studyId, 'workflow', this.workflow.id, 'task', this.currentTask.id]);
    // }
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
    this.updateTaskList(wf.id);
  }

  hasIncompleteUserTask() {
    if (this.allTasks && (this.allTasks.length > 0)) {
      const incompleteStates = [
        WorkflowTaskState.READY,
        WorkflowTaskState.FUTURE,
        WorkflowTaskState.WAITING,
      ];
      const incompleteTasks = this.allTasks.filter(t => incompleteStates.includes(t.state));
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

    if (this.displayFiles && show === undefined) {
      this.toggleDataDisplay(!this.displayFiles);
    }
  }

  resetWorkflow() {
    this.api.getWorkflow(this.workflowId, {hard_reset: true}).subscribe(() => {
      this.snackBar.open(`${this.workflowSpec.display_name} workflow has been reset successfully.`, 'Ok', {duration: 3000});
      this.updateTaskList(this.workflowId);
    });
  }

  // Initializes incoming task from API as proper WorkflowTask class instance.

  confirmResetWorkflow() {
    const data: WorkflowResetDialogData = {
      workflowId: this.workflowId,
      name: this.workflowSpec.display_name,
    };
    const dialogRef = this.dialog.open(WorkflowResetDialogComponent, {data});

    dialogRef.afterClosed().subscribe((dialogData: WorkflowResetDialogData) => {
      if (dialogData && dialogData.confirm) {
        this.resetWorkflow();
      }
    });
  }

  private updateTaskList(workflowId: number, forceTaskId?: string) {
    this.api.listWorkflowFiles(workflowId).subscribe(fms => {
      this.fileMetas = fms;
      this.toggleFilesDisplay(fms.length > 0);
    });
    this.api.getWorkflow(workflowId).subscribe(wf => {
      this.workflow = wf;
      this.api.getWorkflowSpecification(wf.workflow_spec_id).subscribe(s => this.workflowSpec = s);

      this.allTasks = wf.user_tasks.map(this._initTask);

      console.log('All Tasks', this.allTasks);

      // The current task will be set by the backend, unless specifically forced.
      if (forceTaskId) {
        this.currentTask = this.allTasks.filter(t => t.id === forceTaskId)[0];
      } else {
        this.currentTask = this._initTask(wf.next_task);
      }

      this.logTaskData(this.currentTask);
      console.log('forceTaskId', forceTaskId);
      console.log('wf.next_task', wf.next_task);
      console.log('Update URL, at end of task_list', this.currentTask);
      this.updateUrl()
    });
  }

  /**
   * Initializes incoming task from API as proper WorkflowTask class instance.
   * Returns undefined if task is falsy.
   */
  private _initTask(task: WorkflowTask) {
    return task ? Object.assign(new WorkflowTask(), task) : undefined;
  }
}
