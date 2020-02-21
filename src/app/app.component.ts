import {Component} from '@angular/core';
import {User} from 'sartography-workflow-lib';
import {isSignedIn} from './_util/is-signed-in';

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
