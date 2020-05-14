import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, User} from 'sartography-workflow-lib';

interface NavItem {
  path?: string;
  id: string;
  label: string;
  icon?: string;
  links?: NavItem[];
  action?: () => void;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  navLinks: NavItem[];
  user: User;

  constructor(
    private router: Router,
    private api: ApiService,
  ) {
    this._loadUser();
  }

  ngOnInit() {
    this._loadUser();
  }

  isLinkActive(path: string) {
    return path === this.router.url;
  }

  private _loadUser() {
    this.api.getUser().subscribe(u => {
      this.user = u;
      this._loadNavLinks();
    }, error => {
      localStorage.removeItem('token');
    });
  }

  private _loadNavLinks() {
    if (this.user) {
      const displayName = this.user.display_name || this.user.first_name || this.user.last_name;
      this.navLinks = [
        {path: '/help', id: 'nav_help', label: 'Help & User Guide', icon: 'help'},
        {path: '/inbox', id: 'nav_inbox', label: 'Inbox & Notifications', icon: 'notifications'},
        {
          id: 'nav_account', label: `${displayName} (${this.user.email_address})`,
          icon: 'account_circle',
          links: [
            {path: '/profile', id: 'nav_profile', label: 'Profile', icon: 'person'},
            {path: '/notifications', id: 'nav_notifications', label: 'Notifications', icon: 'notifications'},
            {path: '/sign-out', id: 'nav_sign_out', label: 'Sign out', icon: 'exit_to_app'},
          ]
        }
      ];
    }
  }
}
