import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Router, RouterEvent} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {of, ReplaySubject} from 'rxjs';
import {ApiService, MockEnvironment, mockUser0, mockUsers} from 'sartography-workflow-lib';
import {LoadingComponent} from '../loading/loading.component';
import {NavbarComponent} from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock: HttpTestingController;
  const eventSubject = new ReplaySubject<RouterEvent>(1)
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: 'test/url'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoadingComponent,
        NavbarComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
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
    localStorage.setItem('token', 'some_token');
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const userReq = httpMock.expectOne('apiRoot/user');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser0);
    expect(component.user).toEqual(mockUser0);
    expect((component as any).realUser).toEqual(mockUser0);
    expect((component as any).impersonatedUser).toBeUndefined();
    expect(component.isAdmin).toBeTrue();

    const listUsersReq = httpMock.expectOne('apiRoot/list_users');
    expect(listUsersReq.request.method).toEqual('GET');
    listUsersReq.flush(mockUsers);
    expect(component.allUsers).toEqual(mockUsers);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user', () => {
    const _loadNavLinksSpy = spyOn((component as any), '_loadNavLinks').and.callThrough();
    const _loadAdminNavLinksSpy = spyOn((component as any), '_loadAdminNavLinks').and.callThrough();

    (component as any)._loadUser();

    const userReq = httpMock.expectOne('apiRoot/user');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser0);
    expect(component.user).toEqual(mockUser0);
    expect((component as any).realUser).toEqual(mockUser0);
    expect((component as any).impersonatedUser).toBeUndefined();
    expect(component.isAdmin).toBeTrue();
    expect(_loadNavLinksSpy).toHaveBeenCalled();
    expect(_loadAdminNavLinksSpy).toHaveBeenCalled();

    const listUsersReq = httpMock.expectOne('apiRoot/list_users');
    expect(listUsersReq.request.method).toEqual('GET');
    listUsersReq.flush(mockUsers);
    expect(component.allUsers).toEqual(mockUsers);
  });
});
