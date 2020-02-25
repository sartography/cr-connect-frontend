import {Component} from '@angular/core';
import {isSignedIn, User} from 'sartography-workflow-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CR Connect';
  user: User;
  isSignedIn = isSignedIn;

  constructor() {
  }
}
