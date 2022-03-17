import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Study,
  UserService,
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
      .filter(cat => cat.workflows.length > 0)
      // If a category metadata is provided, filter out the hidden categories
      .filter(cat => {
          let meta = true;
          if (cat.meta) {
            meta = cat.meta.state !== WorkflowState.HIDDEN
          }
          return meta;
        });
  }

  workflowsToShow(listItem: WorkflowMetadata[]) {
    return listItem.filter(i => shouldDisplayItem(i));
  }
}
