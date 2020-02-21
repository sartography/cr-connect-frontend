import {Component} from '@angular/core';
import {isSignedIn} from '../_util/is-signed-in';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isSignedIn = isSignedIn;

  constructor() {
  }

}
