import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ApiService, AppEnvironment, GoogleAnalyticsService, User} from 'sartography-workflow-lib';
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
  private realUser: User;
  private impersonatedUser: User;
  title: string;
  allUsers: User[];
  loading = true;

  constructor(
    private router: Router,
    private api: ApiService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.googleAnalyticsService.init(this.environment.googleAnalyticsKey);
    this._loadUser();
    this.title = environment.title;
  }

  private _loadUser() {
    this.loading = true;
    this.impersonatedUser = undefined;
    const impersonateUid = localStorage.getItem('admin_view_as');

    if (this.isAdmin) {
      this.api.getUser(impersonateUid || undefined).subscribe(u => {
        if (this.realUser.uid !== impersonateUid && this.realUser.uid !== u.uid) {
          this.impersonatedUser = u;
        } else {
          this.realUser = u;
        }

        this._afterUserLoad();
      }, error => this._onLoginError());
    } else if (impersonateUid) {
      // Get the real user first
      this.api.getUser().subscribe(u => {
        this.realUser = u;

        // Then impersonate
        if (this.isAdmin) {
          this._loadUser();
        }
      }, error => this._onLoginError());
    } else {
      this.api.getUser().subscribe(u => {
        this.realUser = u;
        this._afterUserLoad();
      }, error => this._onLoginError());
    }
  }

  private _afterUserLoad() {
    if (this.realUser && this.realUser.uid) {
      this.googleAnalyticsService.setUser(this.realUser.uid);
    }

    this._loadNavLinks();

    if (this.isAdmin) {
      this._loadAdminNavLinks();
    } else {
      this.loading = false;
      this.userChanged.emit(this.user);
    }
  }

  private _loadAdminNavLinks() {
    if (this.isAdmin) {
      this.loading = true;
      const isViewingAs = !!localStorage.getItem('admin_view_as');
      this.api.listUsers().subscribe(users => {
        this.allUsers = users;
        this.adminNavLinks = [
          {
            id: 'nav_admin',
            label: isViewingAs ? `Viewing as user ${this.user.uid}` : 'View as...',
            icon: 'preview',
            showLabel: true,
            links: users.map(u => {
              return {
                id: `nav_user_${u.uid}`,
                label: `${u.display_name} (${u.uid})`,
                icon: 'person',
                action: () => this.viewAs(u.uid),
                showLabel: true,
                disabled: u.uid === this.user.uid,
              } as NavItem;
            })
          }
        ];
        this.loading = false;
        this.userChanged.emit(this.user);
      });
    }
  }

  private _loadNavLinks() {
    if (this.user) {
      const displayName = this.user.display_name || this.user.first_name || this.user.last_name;

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
            label: `${displayName} (${this.user.email_address})`,
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

  get isAdmin(): boolean {
    let flag = false;
    if (this.realUser && this.realUser.is_admin)
      flag = true;
    localStorage.setItem('userIsAdmin',flag.toString());
    return flag;
  }

  get user(): User {
    if (this.isAdmin) {
      const isViewingAs = !!localStorage.getItem('admin_view_as') && this.impersonatedUser;
      return isViewingAs ? this.impersonatedUser : this.realUser;
    } else {
      return this.realUser;
    }
  }

  get isImpersonating(): boolean {
    return !!(localStorage.getItem('admin_view_as') && this.impersonatedUser);
  }

  viewAs(uid: string) {
    if (this.isAdmin && (uid !== this.realUser.uid)) {
      localStorage.setItem('admin_view_as', uid);
    } else {
      localStorage.removeItem('admin_view_as');
    }

    this._loadUser();
  }

  private _onLoginError() {
    localStorage.removeItem('admin_view_as');
    localStorage.removeItem('token');
  }
}
