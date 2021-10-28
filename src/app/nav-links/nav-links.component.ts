import {Component, Inject, Input} from '@angular/core';
import {NavItem} from '../_interfaces/nav-item';
import {Router} from '@angular/router';
import {ApiService, AppEnvironment, UserService} from 'sartography-workflow-lib';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";

@Component({
  selector: 'app-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.scss']
})
export class NavLinksComponent {
  @Input() links: NavItem[];
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'lookup',
      type: 'autocomplete_ldap',
      templateOptions: {
      }
    },
  ];

  viewAs(uid?: any) {
    console.log('uid', uid);
    if ('lookup' in uid && uid['lookup'] !== 'invalid') {
      this.userService.viewAs(uid['lookup']);
    }
  }

  constructor(
    private router: Router,
    private api: ApiService,
    private userService: UserService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
  ) {
  }

  isLinkActive(path: string) {
    return path === this.router.url;
  }

}
