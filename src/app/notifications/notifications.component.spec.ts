import {APP_BASE_HREF} from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {NotificationsComponent} from './notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
