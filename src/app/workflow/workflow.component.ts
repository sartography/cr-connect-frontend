import {ChangeDetectorRef, Component} from '@angular/core';
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
  allTasks: WorkflowTask[];
  currentTask: WorkflowTask;
  private studyId: number;
  private workflowId: number;
  private taskId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.studyId = parseInt(paramMap.get('study_id'), 10);
      this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
      this.taskId = paramMap.get('task_id');
      this.api.getWorkflow(this.workflowId).subscribe( wf => {
        this.workflow = wf;
        this.updateTaskList(this.workflow);
      });
    });
  }

  private updateTaskList(workflow: Workflow) {
    this.api.getTaskListForWorkflow(workflow.id, true).subscribe(allTasks => {
      this.allTasks = allTasks;
      if (this.taskId) {
        this.currentTask = this.allTasks.find(t => t.id === this.taskId);
        this.changeDetectorRef.detectChanges();
      }

      this.api.getTaskListForWorkflow(workflow.id).subscribe( readyTasks => {
        this.readyTasks = readyTasks;
        if ((this.readyTasks.length >= 1) && (!this.taskId || !this.currentTask)) {
          this.setCurrentTask(this.readyTasks[0]);
        }
      });
    });
  }

  setCurrentTask(task: WorkflowTask) {
    this.router.navigate(['study', this.studyId, 'workflow', this.workflow.id, 'task', task.id]);
  }

  workflowUpdated(wf: Workflow) {
    this.workflow = wf;
    this.taskId = undefined;
    this.currentTask = undefined;
    this.updateTaskList(wf);
  }

}
