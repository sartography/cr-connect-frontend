import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

interface NavItem {
  path?: string;
  id: string;
  label: string;
  icon?: string;
  links?: NavItem[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  signedInNavLinks: NavItem[] = [
    {path: '/', id: 'nav_home', label: 'Home'},
    {path: '/inbox', id: 'nav_inbox', label: 'Inbox'},
    {path: '/help', id: 'nav_help', label: 'Help'},
    {
      id: 'nav_account', label: 'Account',
      icon: 'account_circle',
      links: [
        {path: '/profile', id: 'nav_profile', label: 'Profile', icon: 'person'},
        {path: '/notifications', id: 'nav_notifications', label: 'Notifications', icon: 'notifications'},
        {path: '/sign-out', id: 'nav_sign_out', label: 'Sign out', icon: 'exit_to_app'},
      ]
    }
  ];
  signedOutNavLinks: NavItem[] = [
    {path: '/', id: 'nav_home', label: 'Home'},
    {path: '/help', id: 'nav_help', label: 'Help'},
    {path: '/sign-in', id: 'nav_sign_in', label: 'Sign in'},
  ];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  isSignedIn(): boolean {
    return !!localStorage.getItem('signedIn');
  }

  isLinkActive(path: string) {
    return path === this.router.url;
  }
}
