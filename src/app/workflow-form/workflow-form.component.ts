import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {FormlyFormOptions} from '@ngx-formly/core';
import {Subscription} from 'rxjs';
import {ApiService, Study, Workflow, WorkflowTask} from 'sartography-workflow-lib';
import createClone from 'rfdc';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})
export class WorkflowFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() task: WorkflowTask;
  @Input() workflow: Workflow;
  @Output() workflowUpdated: EventEmitter<Workflow> = new EventEmitter();
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: any = {};
  sub: Subscription;
  loading = true;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this._loadModel(this.task);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task) {
      this._loadModel(changes.task.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  saveTaskData(task: WorkflowTask) {
    this.api.updateTaskDataForWorkflow(this.workflow.id, task.id, this.model).subscribe(
      updatedWorkflow => {
        this.workflowUpdated.emit(updatedWorkflow);
      }
    );
  }

  private _loadModel(task: WorkflowTask) {
    this.loading = true;
    this.sub = this.route.paramMap.subscribe(paramMap => {
      this.model = createClone()(task.data);
      this.loading = false;
      this.changeDetectorRef.detectChanges();
    });
  }
}
