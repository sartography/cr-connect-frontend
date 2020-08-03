import {Component, Inject, Input, OnInit} from '@angular/core';
import {NavItem} from '../_interfaces/nav-item';
import {Router} from '@angular/router';
import {ApiService, AppEnvironment} from 'sartography-workflow-lib';

@Component({
  selector: 'app-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.scss']
})
export class NavLinksComponent implements OnInit {
  @Input() links: NavItem[];

  constructor(
    private router: Router,
    private api: ApiService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
  ) {
  }

  ngOnInit(): void {
  }

  isLinkActive(path: string) {
    return path === this.router.url;
  }

}
