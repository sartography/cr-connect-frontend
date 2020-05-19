import {Component, Inject} from '@angular/core';
import {AppEnvironment} from 'sartography-workflow-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isSignedIn: boolean;

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment
  ) {
    if (!this.environment.production) {
      const token = localStorage.getItem('token');
      console.log('HomeComponent constructor token', token)
      this.isSignedIn = !!token;
    } else {
      this.isSignedIn = true;
    }
  }

}
