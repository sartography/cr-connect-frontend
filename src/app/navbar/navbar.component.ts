import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, AppEnvironment, UserService, User, GoogleAnalyticsService} from 'sartography-workflow-lib';
import {NavItem} from '../_interfaces/nav-item';
import {UserPreferencesService} from '../user-preferences.service';
import {Preferences} from '../preferences.model';


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
  public realUser: User;  // We may be impersonating a different user
  public userIsAdmin: boolean;
  public userIsImpersonating: boolean;
  public preferences: Preferences;

  constructor(
    private router: Router,
    private api: ApiService,
    private userService: UserService,
    private userPreferencesService: UserPreferencesService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private googleAnalyticsService: GoogleAnalyticsService,
) {
    this.loading = true;
    this.googleAnalyticsService.init(this.environment.googleAnalyticsKey);
    this.userService.userChanged.subscribe(() => this.handleCallback());
    this.userService.user$.subscribe(u=>this.user = u);
    this.userService.realUser$.subscribe(u=>this.realUser = u);
    this.userService.isAdmin$.subscribe(a=>this.userIsAdmin = a);
    this.userService.isImpersonating$.subscribe(a=>this.userIsImpersonating = a);
    this.title = this.environment.title;
    this.userPreferencesService.preferences$.subscribe(p=> {
      this.preferences = p;
    });
  }

  private handleCallback() {
    this._loadNavLinks();
    this._loadAdminNavLinks();
    this.loading = false;
  }

  private _loadAdminNavLinks() {
    if (this.userIsAdmin) {
      this.loading = true;
      this.api.listUsers().subscribe(users => {
        this.allUsers = users;
        this.adminNavLinks = [
          {
            id: 'nav_admin',
            label: this.userIsImpersonating ? `Viewing as user ${this.user.uid}` : 'View as...',
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
          },
          {
            id: 'toggle_admin',
            label: 'Toggle Admin Tools',
            icon: 'admin_panel_settings',
            action: () => this.toggleAdminViewPreference(),
            toggled: () => this.isAdminView(),
            showLabel: true,
          },
        ];
        this.loading = false;
        this.userChanged.emit(this.user);
      });
    }
  }

  private toggleAdminViewPreference() {
    this.preferences.showAdminTools = !this.preferences.showAdminTools;
    this.userPreferencesService.updatePreferences(this.preferences)
  }

  public isAdminView() {
    return this.preferences.showAdminTools;
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
