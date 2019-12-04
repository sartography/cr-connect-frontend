import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowProcessMenuItemComponent } from './workflow-process-menu-item.component';

describe('WorkflowProcessMenuItemComponent', () => {
  let component: WorkflowProcessMenuItemComponent;
  let fixture: ComponentFixture<WorkflowProcessMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowProcessMenuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowProcessMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
