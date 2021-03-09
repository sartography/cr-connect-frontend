import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ApiService, AppEnvironment, UserService, User} from 'sartography-workflow-lib';
import {NavItem} from '../_interfaces/nav-item';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() userChanged = new EventEmitter<User>();
  navLinks: NavItem[];
  adminNavLinks: NavItem[];
  title: string;
  allUsers: User[];
  loading = true;

  constructor(
    private router: Router,
    private api: ApiService,
    public userService: UserService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,

  ) {
    this.userService.googleAnalyticsService.init(this.environment.googleAnalyticsKey);
    this.loading = true;
    this.userService.userChanged.subscribe(() => {this.handleCallback()})
    this.userService._loadUser();
    this.title = environment.title;
  }

  private handleCallback() {
    if (this.userService.user.is_admin){
      this._loadAdminNavLinks()
    }
    else {
      this._loadNavLinks()
    }
  }

  private _loadAdminNavLinks() {
    if (this.userService.isAdmin) {
      this.loading = true;
      const isViewingAs = !!localStorage.getItem('admin_view_as');
      this.api.listUsers().subscribe(users => {
        this.allUsers = users;
        this.adminNavLinks = [
          {
            id: 'nav_admin',
            label: isViewingAs ? `Viewing as user ${this.userService.user.uid}` : 'View as...',
            icon: 'preview',
            showLabel: true,
            links: users.map(u => {
              return {
                id: `nav_user_${u.uid}`,
                label: `${u.display_name} (${u.uid})`,
                icon: 'person',
                action: () => this.userService.viewAs(u.uid),
                showLabel: true,
                disabled: u.uid === this.userService.user.uid,
              } as NavItem;
            })
          }
        ];
        this.loading = false;
        this.userChanged.emit(this.userService.user);
      });
    }
  }

  private _loadNavLinks() {
    if (this.userService.user) {
      const displayName = this.userService.user.display_name || this.userService.user.first_name || this.userService.user.last_name;

      if (this.environment.homeRoute === 'research') {
        this.navLinks = [
          {
            path: '/research',
            id: 'nav_research',
            label: 'Your Research Requests',
            icon: 'all_inbox',
            showLabel: false,
          },
        ];
      } else {
        this.navLinks = [
          {
            path: '/help',
            id: 'nav_help',
            label: 'Help & User Guide',
            icon: 'help',
            showLabel: false,
          },
          {
            path: '/inbox',
            id: 'nav_inbox',
            label: 'Inbox & Notifications',
            icon: 'notifications',
            showLabel: false,
          },
          {
            id: 'nav_account',
            label: `${displayName} (${this.userService.user.email_address})`,
            icon: 'account_circle',
            showLabel: true,
            links: [
              {
                path: '/profile',
                id: 'nav_profile',
                label: 'Profile',
                icon: 'person',
                showLabel: true,

              },
              {
                path: '/notifications',
                id: 'nav_notifications',
                label: 'Notifications',
                icon: 'notifications',
                showLabel: true,
              },
            ]
          }
        ];
      }

    }
  }

}
