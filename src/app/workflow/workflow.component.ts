import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, Workflow, WorkflowTask} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
  workflow: Workflow;
  readyTasks: WorkflowTask[];
  currentTask: WorkflowTask;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    const paramMap = this.route.snapshot.paramMap;
    const workflowId = parseInt(paramMap.get('workflow_id'), 10);
    this.api.getWorkflow(workflowId).subscribe( wf => {
      this.workflow = wf;
      this.updateTaskList(this.workflow);
    });
  }

  private updateTaskList(workflow: Workflow) {
    this.api.getTaskListForWorkflow(workflow.id).subscribe( tasks => {
      this.readyTasks = tasks;
      if (this.readyTasks.length === 1) {
        this.currentTask = this.readyTasks[0];
      }
    });
  }

  setCurrentTask(task: WorkflowTask) {
    this.currentTask = task;
  }

  workflowUpdated(wf: Workflow) {
    this.workflow = wf;
    this.updateTaskList(wf);
  }

}
