import {Component, Inject, Input} from '@angular/core';
import {NavItem} from '../_interfaces/nav-item';
import {Router} from '@angular/router';
import {ApiService, AppEnvironment} from 'sartography-workflow-lib';

@Component({
  selector: 'app-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.scss']
})
export class NavLinksComponent {
  @Input() links: NavItem[];

  constructor(
    private router: Router,
    private api: ApiService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
  ) {
  }

  isLinkActive(path: string) {
    return path === this.router.url;
  }

}
