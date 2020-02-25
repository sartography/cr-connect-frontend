import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, Workflow, WorkflowTask, WorkflowTaskState, WorkflowTaskType} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
  workflow: Workflow;
  readyTasks: WorkflowTask[];
  allTasks: WorkflowTask[];
  currentTask: WorkflowTask;
  studyId: number;
  workflowId: number;
  taskId: string;
  taskTypes = WorkflowTaskType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.studyId = parseInt(paramMap.get('study_id'), 10);
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
      this.updateTaskList(this.workflowId, paramMap.get('task_id'));
    });
  }

  setCurrentTask(task: WorkflowTask) {
    this.currentTask = task;
    // TODO: Change the URL without hitting the router??
    this.router.navigate(['study', this.studyId, 'workflow', this.workflow.id, 'task', task.id]);
  }

  logTaskData(task) {
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

  workflowUpdated(wf: Workflow) {
    this.workflow = wf;
    this.taskId = undefined;
    this.currentTask = undefined;
    this.updateTaskList(wf.id);
  }

  private updateTaskList(workflowId: number, forceTaskId?: string) {
    this.api.getWorkflow(workflowId).subscribe(wf => {
      this.workflow = wf;

      // De-dupe tasks, in case of parallel joins
      this.allTasks = this.dedupeTasks(wf.user_tasks || []);

      if (this.allTasks && (this.allTasks.length > 0)) {
        this.readyTasks = this.allTasks.filter(t => t.state === WorkflowTaskState.READY);
      }

      // The current task will be set by the backend, unless specifically forced.
      if (forceTaskId) {
        this.currentTask = this.allTasks.filter(t => t.id === forceTaskId)[0];
      } else {
        this.currentTask = wf.next_task;
      }
      this.logTaskData(this.currentTask);

    });
  }

  private dedupeTasks(workflowTasks: WorkflowTask[]): WorkflowTask[] {
    const deduped: { [key: string]: WorkflowTask; } = {};
    workflowTasks.forEach(t => {
      if (deduped.hasOwnProperty(t.name)) {
        delete deduped[t.name];
      }

      deduped[t.name] = t;
    });
    return Object.values(deduped);
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
}
