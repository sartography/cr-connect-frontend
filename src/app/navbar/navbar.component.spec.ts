import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Router, RouterEvent} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {of, ReplaySubject} from 'rxjs';
import {ApiService, MockEnvironment, mockUser0, mockUsers, UserService, mockUser1} from 'sartography-workflow-lib';
import {LoadingComponent} from '../loading/loading.component';
import {NavbarComponent} from './navbar.component';
import 'zone.js/dist/zone-testing';


describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock: HttpTestingController;
  let user: UserService;
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
        UserService,
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
    localStorage.removeItem( 'admin_view_as');
    localStorage.setItem('token', 'some_token');
    httpMock = TestBed.inject(HttpTestingController);
    user = TestBed.inject(UserService);

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    const _loadNavLinksSpy = spyOn((component as any), '_loadNavLinks').and.callThrough();
    const _loadAdminNavLinksSpy = spyOn((component as any), '_loadAdminNavLinks').and.callThrough();
    fixture.detectChanges();
    const userReq = httpMock.expectOne('apiRoot/user');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser0);
    const listUsersReq = httpMock.expectOne('apiRoot/list_users');
    expect(listUsersReq.request.method).toEqual('GET');
    listUsersReq.flush(mockUsers);
    expect(component.allUsers).toEqual(mockUsers);
    expect(_loadNavLinksSpy).toHaveBeenCalled();
    expect(_loadAdminNavLinksSpy).toHaveBeenCalled();



  });

  afterEach(() => {

    httpMock.verify();
    fixture.destroy();
    localStorage.removeItem('admin_view_as')
  });

  it('should create', () =>{
    expect(component).toBeTruthy();
  });


  it('should load user', () => {
    expect(!!localStorage.getItem( 'admin_view_as')).toBeFalse();
    expect(((component as any).userService as any)._realUser.value).toEqual(mockUser0);
    expect(component.userIsAdmin).toBeTrue();
    expect((component as any).userIsImpersonating).toBeFalse();

  });

  it('should impersonate user',fakeAsync(() => {
    // click on the nav link and then verify user is != realUser

    ((component as any).userService as any).viewAs('rhh8n')
    // First step - we get back the main user
    const userReq1 = httpMock.expectOne('apiRoot/user');
    expect(userReq1.request.method).toEqual('GET');
    userReq1.flush(mockUser0);
    // second step - we get back the impersonated user
    const userReq = httpMock.expectOne('apiRoot/user?admin_impersonate_uid=rhh8n');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser1);

    // now we should be impersonating but still admin so we can still switch
    expect(localStorage.getItem( 'admin_view_as')).toEqual('rhh8n')
    expect(component.userIsAdmin).toBeTrue();
    expect((component as any).userIsImpersonating).toBeTruthy();

  }));


});
