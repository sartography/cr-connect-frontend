import { Component, OnInit } from '@angular/core';

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
  navLinks: NavLink[] = [
    {path: '/dashboard', label: 'Dashboard'},
    {path: '/inbox', label: 'Inbox'},
    {path: '/help', label: 'Help'},
    {path: '/preferences', label: 'Preferences'},
    {path: '/logout', label: 'Logout'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
