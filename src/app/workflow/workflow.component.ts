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
  private studyId: number;
  private workflowId: number;
  private taskId: string;
  taskTypes = WorkflowTaskType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.studyId = parseInt(paramMap.get('study_id'), 10);
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
      this.taskId = paramMap.get('task_id');
      this.api.getWorkflow(this.workflowId).subscribe(wf => {
        this.workflow = wf;
        this.updateTaskList(this.workflow);
      });
    });
  }

  setCurrentTask(task: WorkflowTask) {
    this.currentTask = task;

    // TODO: Change the URL without hitting the router??
    this.router.navigate(['study', this.studyId, 'workflow', this.workflow.id, 'task', task.id]);
  }

  workflowUpdated(wf: Workflow) {
    this.workflow = wf;
    this.taskId = undefined;
    this.currentTask = undefined;
    this.updateTaskList(wf);
  }

  private updateTaskList(workflow: Workflow) {
    this.api.getWorkflow(workflow.id).subscribe(wf => {
      let currentTask: WorkflowTask;
      this.allTasks = wf.user_tasks || [];
      if (this.allTasks && (this.allTasks.length > 0)) {
        this.readyTasks = this.allTasks.filter(t => t.state === WorkflowTaskState.READY);
        const taskId = this.taskId ||
          (wf.next_task && wf.next_task.id) ||
          (this.readyTasks && this.readyTasks[0].id) ||
          wf.user_tasks[0].id;
        if (taskId) {
          currentTask = this.allTasks.find(t => t.id === taskId);
          if (currentTask) {
            this.setCurrentTask(currentTask);
          }
        }
      }

      if (!currentTask) {
        this.currentTask = wf.last_task || undefined;
      }
    });
  }

}
