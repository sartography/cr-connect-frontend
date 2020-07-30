import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, AppEnvironment, GoogleAnalyticsService, User} from 'sartography-workflow-lib';
import {NavItem} from '../_interfaces/nav-item';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  navLinks: NavItem[];
  adminNavLinks: NavItem[];
  user: User;
  title: string;
  allUsers: User[];

  constructor(
    private router: Router,
    private api: ApiService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this._loadUser();
    this.title = environment.title;
  }

  private _loadUser() {
    const uid = localStorage.getItem('admin_view_as');
    this.api.getUser(uid).subscribe(u => {
      console.log('user:', u);
      this.user = u;

      if (this.user && this.user.uid) {
        this.googleAnalyticsService.setUser(this.user.uid);
      }

      this._loadNavLinks();

      if (this.user && this.user.is_admin) {
        this._loadAdminNavLinks();
      }
    }, error => {
      localStorage.removeItem('token');
    });
  }

  private _loadAdminNavLinks() {
    const isViewingAs = !!localStorage.getItem('admin_view_as');


    if (this.user && this.user.is_admin) {
      this.api.listUsers().subscribe(users => {
        this.allUsers = users;
        console.log('allUsers', this.allUsers);
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
              } as NavItem;
            })
          }
        ];
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

  private viewAs(uid: string) {
    localStorage.setItem('admin_view_as', uid);
  }
}
