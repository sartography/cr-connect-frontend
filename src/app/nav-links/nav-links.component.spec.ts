import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment, mockUser0, mockUsers, UserService} from 'sartography-workflow-lib';
import {NavLinksComponent} from './nav-links.component';
import {NavbarComponent} from "../navbar/navbar.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

describe('NavLinksComponent', () => {
  let component: NavLinksComponent;
  let fixture: ComponentFixture<NavLinksComponent>;
  let httpMock: HttpTestingController;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavLinksComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatAutocompleteModule,
      ],
      providers: [
        ApiService, UserService,
        {
          provide: Router,
          useValue: mockRouter
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(NavLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const userReq = httpMock.expectOne('apiRoot/user');
    expect(userReq.request.method).toEqual('GET');

  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
