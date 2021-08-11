import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProcessViewerComponent } from './process-viewer.component';

describe('ProcessViewerComponent', () => {
  let component: ProcessViewerComponent;
  let fixture: ComponentFixture<ProcessViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
