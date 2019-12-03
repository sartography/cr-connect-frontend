import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSpecListComponent } from './task-spec-list.component';

describe('TaskSpecListComponent', () => {
  let component: TaskSpecListComponent;
  let fixture: ComponentFixture<TaskSpecListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSpecListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSpecListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
