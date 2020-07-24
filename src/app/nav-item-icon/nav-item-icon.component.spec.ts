import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavItemIconComponent } from './nav-item-icon.component';

describe('NavItemIconComponent', () => {
  let component: NavItemIconComponent;
  let fixture: ComponentFixture<NavItemIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavItemIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavItemIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
