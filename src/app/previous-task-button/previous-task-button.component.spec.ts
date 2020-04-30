import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousTaskButtonComponent } from './previous-task-button.component';

describe('PreviousTaskButtonComponent', () => {
  let component: PreviousTaskButtonComponent;
  let fixture: ComponentFixture<PreviousTaskButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousTaskButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousTaskButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
