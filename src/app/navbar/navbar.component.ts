import {Component, Input, OnInit} from '@angular/core';

interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() signedIn: boolean;
  navLinks: NavLink[] = [
    {path: '/studies', label: 'Home'},
    {path: '/inbox', label: 'Inbox'},
    {path: '/help', label: 'Help'},
    {path: '/preferences', label: 'Preferences'},
    {path: '/signout', label: 'Sign out'},
  ];
  signedOutNavLinks: NavLink[] = [
    {path: '/', label: 'Home'},
    {path: '/help', label: 'Help'},
    {path: '/signin', label: 'Sign in'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
