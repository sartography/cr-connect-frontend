import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService, Workflow, WorkflowTask, WorkflowTaskType} from 'sartography-workflow-lib';

@Component({
  selector: 'app-previous-task-button',
  templateUrl: './previous-task-button.component.html',
  styleUrls: ['./previous-task-button.component.scss']
})
export class PreviousTaskButtonComponent implements OnInit {
  @Input() workflow: Workflow;
  @Input() currentTask: WorkflowTask;
  @Output() workflowUpdated: EventEmitter<Workflow> = new EventEmitter();

  constructor(private api: ApiService) {
  }

  get hasPreviousTask(): boolean {
    return !!(
      this.workflow.last_task &&
      this.workflow.last_task.id !== this.currentTask.id &&
      this.workflow.last_task.type !== WorkflowTaskType.NONE_TASK &&
      this.workflow.last_task.type !== WorkflowTaskType.START_TASK
    );
  }

  ngOnInit(): void {
  }

  previousTask() {
    if (this.hasPreviousTask) {
      this.api
        .setCurrentTaskForWorkflow(this.workflow.id, this.workflow.last_task.id)
        .subscribe(wf => this.workflowUpdated.emit(wf));
    }
  }
}
