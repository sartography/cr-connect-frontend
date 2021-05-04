import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandaloneComponent } from './standalone.component';
import {ApiService, MockEnvironment} from 'sartography-workflow-lib';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

describe('StandaloneComponent', () => {
  let component: StandaloneComponent;
  let fixture: ComponentFixture<StandaloneComponent>;
  const mockEnvironment = new MockEnvironment();
  const mockRouter = {navigate: jasmine.createSpy('navigate')};


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandaloneComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useValue: mockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
