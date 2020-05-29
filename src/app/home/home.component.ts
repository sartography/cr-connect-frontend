import {Component, Inject} from '@angular/core';
import {AppEnvironment} from 'sartography-workflow-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment) {}

}
