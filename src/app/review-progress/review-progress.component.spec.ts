import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {mockStudy0, WorkflowStatus} from 'sartography-workflow-lib';
import { ReviewProgressComponent } from './review-progress.component';

describe('ReviewProgressComponent', () => {
  let component: ReviewProgressComponent;
  let fixture: ComponentFixture<ReviewProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewProgressComponent);
    component = fixture.componentInstance;
    component.study = mockStudy0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should calculate percent complete', () => {
    component.study.categories.forEach(cat => cat.workflows.forEach(wf => {
      wf.status = WorkflowStatus.COMPLETE;
      wf.is_review = true;
      }
    ));
    component.calculatePercentComplete();
    expect(component.percentComplete).toEqual(100);
  });
});
