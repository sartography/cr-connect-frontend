import { Component } from '@angular/core';
import {Router } from '@angular/router';
import {WorkflowSpec, ApiService} from 'sartography-workflow-lib';

@Component({
  selector: 'app-standalone',
  templateUrl: './standalone.component.html',
  styleUrls: ['./standalone.component.scss']
})
export class StandaloneComponent {
  workflowSpecs: WorkflowSpec[];

  constructor(
    private api: ApiService,
    private router: Router) {
    this.getStandalone();
  }

  getStandalone() {
    this.api.getWorkflowSpecificationStandalone().subscribe(wf => this.workflowSpecs = wf);
  }

  getWorkflowFromSpec(spec) {
    this.api.getWorkflowFromSpec(spec.id).subscribe(wf => {
      this.router.navigate(['workflow', wf.id]);
    });
  }

}
