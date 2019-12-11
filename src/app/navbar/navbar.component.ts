import {Component, Input, OnInit} from '@angular/core';

interface NavItem {
  label: string;
  path?: string;
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
    {path: '/studies', label: 'Home'},
    {path: '/inbox', label: 'Inbox'},
    {path: '/help', label: 'Help'},
    {
      label: 'Account',
      icon: 'account_circle',
      links: [
        {path: '/profile', label: 'Profile', icon: 'person'},
        {path: '/notifications', label: 'Notifications', icon: 'notifications'},
        {path: '/sign-out', label: 'Sign out', icon: 'exit_to_app'},
    ]}
  ];
  signedOutNavLinks: NavItem[] = [
    {path: '/', label: 'Home'},
    {path: '/help', label: 'Help'},
    {path: '/sign-in', label: 'Sign in'},
  ];

  constructor() { }

  ngOnInit() {
  }

  isSignedIn(): boolean {
    return !!localStorage.getItem('signedIn');
  }

}
