import {Component, Inject} from '@angular/core';
import {AppEnvironment} from 'sartography-workflow-lib';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent {
  isSignedIn: boolean;

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment
  ) {
    if (!this.environment.production) {
      const token = localStorage.getItem('token');
      console.log('ResearchComponent constructor token', token)
      this.isSignedIn = !!token;
    } else {
      this.isSignedIn = true;
    }
  }

}
