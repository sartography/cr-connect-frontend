import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Study,
  UserService,
  WorkflowCategoryMetadata,
  WorkflowMetadata,
  WorkflowSpecCategory,
  WorkflowState,
  WorkflowStatus,
} from 'sartography-workflow-lib';
import {shouldDisplayItem} from '../_util/nav-item';
import {UserPreferencesService} from "../user-preferences.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  @Input() study: Study;
  @Input() selectedWorkflowId: number;
  showAdminTools: boolean;
  categoryTabs: WorkflowSpecCategory[];
  statuses = WorkflowStatus;
  states = WorkflowState;
  isAdmin: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private userPreferencesService: UserPreferencesService,
  ) {
    this.userService.isAdmin$.subscribe(a => {
      this.isAdmin = a;
    });
    this.userPreferencesService.preferences$.subscribe(p => {
      this.showAdminTools = p.showAdminTools;
    });
  }


  requiredItem(wf: WorkflowMetadata): boolean{
    return ((wf.state === WorkflowState.REQUIRED)||(wf.state === WorkflowState.DISABLED));
  }

  ngOnInit() {
    console.log('this.study', this.study);
    this.categoryTabs = this.study.categories
      .sort((a, b) => (a.display_order < b.display_order) ? -1 : 1)
      .map(cat => {
        cat.workflows = cat.workflows
      // testing    .map(wf=>this.assignRandomStuff(wf) )
          .filter(wf => wf.state !== WorkflowState.HIDDEN)
          .sort((a, b) => (a.display_order < b.display_order) ? -1 : 1);
        return cat;
      })
      .filter(cat=> cat.meta.state !== WorkflowState.HIDDEN)
      .filter(cat => cat.workflows.length > 0);

    this.route.queryParamMap.subscribe(qParams => {
      const catIdStr = qParams.get('category');
      const wfIdStr = qParams.get('workflow');
      const catId = catIdStr ? parseInt(catIdStr, 10) : undefined;
      const wfId = wfIdStr ? parseInt(wfIdStr, 10) : undefined;
    });
  }

  getStatusLabel(workflow: WorkflowMetadata) {
    switch (workflow.status) {
      case WorkflowStatus.NOT_STARTED:
        return 'Not started';
      case WorkflowStatus.USER_INPUT_REQUIRED:
        return `${workflow.completed_tasks} / ${workflow.total_tasks} tasks complete`;
      case WorkflowStatus.COMPLETE:
        return 'Complete';
      case WorkflowStatus.WAITING:
        return 'Waiting...';
      default:
        return;
    }
  }

  getStateLabel(workflow: WorkflowMetadata) {
    switch (workflow.state) {
      case WorkflowState.HIDDEN:
        return '';
      case WorkflowState.OPTIONAL:
        return 'Optional';
      case WorkflowState.REQUIRED:
        return 'Required';
      case WorkflowState.DISABLED:
        return 'Waiting...';
      default:
        return;
    }
  }

  workflowsToShow(listItem: (WorkflowMetadata | WorkflowCategoryMetadata)[]) {
    return listItem.filter(i => shouldDisplayItem(i));
  }

  allComplete(cat: WorkflowSpecCategory) {
    return cat.workflows.every(wf => wf.status === WorkflowStatus.COMPLETE);
  }

}
