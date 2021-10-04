import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkflowProgressMenuComponent } from './workflow-progress-menu.component';

describe('WorkflowProgressMenuComponent', () => {
  let component: WorkflowProgressMenuComponent;
  let fixture: ComponentFixture<WorkflowProgressMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowProgressMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowProgressMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
