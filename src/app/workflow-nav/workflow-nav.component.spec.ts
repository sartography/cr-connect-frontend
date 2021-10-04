import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkflowNavComponent } from './workflow-nav.component';

describe('WorkflowNavComponent', () => {
  let component: WorkflowNavComponent;
  let fixture: ComponentFixture<WorkflowNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
