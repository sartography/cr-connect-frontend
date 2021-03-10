import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, AppEnvironment, UserService, User, GoogleAnalyticsService} from 'sartography-workflow-lib';
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
  public user: User;
  public userIsAdmin: boolean;
  public userIsImpersonating: boolean;

  constructor(
    private router: Router,
    private api: ApiService,
    private userService: UserService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private googleAnalyticsService: GoogleAnalyticsService,
) {
    this.loading = true;
    this.googleAnalyticsService.init(this.environment.googleAnalyticsKey)
    this.userService.userChanged.subscribe(() => this.handleCallback());
    this.userService.user$.subscribe(u=>this.user = u);
    this.userService.isAdmin$.subscribe(a=>this.userIsAdmin = a)
    this.userService.isImpersonating$.subscribe(a=>this.userIsImpersonating = a)
    this.title = this.environment.title;
  }

  private handleCallback() {
    this._loadNavLinks()
    if (this.user.is_admin){
      this._loadAdminNavLinks()
    }
    this.loading = false;
  }

  private _loadAdminNavLinks() {
    if (this.userIsAdmin) {
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
                action: () => this.userService.viewAs(u.uid),
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

}
