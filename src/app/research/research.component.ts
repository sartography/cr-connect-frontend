import {Component, Inject, OnInit} from '@angular/core';
import {
  ApiService,
  AppEnvironment,
  Approval, ApprovalStatus,
  ApprovalStatusLabels,
  ProtocolBuilderStatus,
  User,
  Workflow
} from 'sartography-workflow-lib';
import {Study} from 'sartography-workflow-lib/lib/types/study';
import {Router} from '@angular/router';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit  {
  isSignedIn: boolean;
  user: User;
  studies: Study[] = [];
  status = ProtocolBuilderStatus;
  approvalStatus = ApprovalStatus;
  approvalStatusLabels = ApprovalStatusLabels;
  loading = true;

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private api: ApiService,
    private router: Router
  ) {
    this.loading = true;
    if (!this.environment.production) {
      const token = localStorage.getItem('token');
      this.isSignedIn = !!token;
    } else {
      this.isSignedIn = true;
    }
  }

  ngOnInit(): void {
    this.api.getUser().subscribe( user => {
      this.user = user
    });
    this.api.getStudies().subscribe( studies => {
      this.studies = studies;
      this.loading = false;
    });
  }

  getWorkflow(study): Workflow {
    // In the case of research review requests, we assume there is
    // only one category, and only one workflow for any "Study".
    return study.categories[0].workflows[0].id
  }


  addStudy() {
    // Assumes the current user is the PI, but we could make this work
    // for people submitting this on behalf of multiple PIs by asking
    // for pi uid.
    const study: Study = {title:'Untitled Request by ' + this.user.display_name,
                          primary_investigator_id: this.user.uid};
    this.api.addStudy(study).subscribe(s => {
        this.studies.push(s);
        this.router.navigate(['study', s.id, 'workflow', s.categories[0].workflows[0].id])
    });
  }

  isActiveStudy(study: Study) {
    return (
      study.protocol_builder_status === ProtocolBuilderStatus.ACTIVE.valueOf().toUpperCase() &&
      !study.approvals ||
      study.approvals.length === 0
    );
  }

  // E1:Clinician Physician
  // E0:Professor
  // E0:AS-Psychology
  // E1:UPG-MD-NEUR Neurology
  // E0:MD-NEUR Neurology
  // E0:CU-Human Svcs
  // U1:Arts & Sciences Undergraduate
  itemsFromLdap(department: string): string[] {
    const ldapRe = new RegExp(/^([A-Z][0-9]+):([A-Z]+[\-|\s])+(.*)$|^([A-Z][0-9]+):([A-Za-z&]+\s)+(.*)$|^([A-Z][0-9]+):([\w]+)$/);
    const ldapItems = department.split(', ');
    const items = new Set<string>();

    for (const item of ldapItems) {
      if (ldapRe.test(item)) {
        const s = item.replace(ldapRe, (_, p1, p2, p3, p4, p5, p6, p7, p8) => {
          return p3 || p5 + p6 || p8;
        });
        items.add(s);
      } else {
        items.add(item)
      }
    }

    return Array.from<string>(items);
  }
}
