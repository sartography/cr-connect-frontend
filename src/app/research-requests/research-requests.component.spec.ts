import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestsComponent } from './research-requests.component';

describe('ResearchRequestsComponent', () => {
  let component: ResearchRequestsComponent;
  let fixture: ComponentFixture<ResearchRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
