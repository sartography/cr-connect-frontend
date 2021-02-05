import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {mockStudy0, WorkflowStatus} from 'sartography-workflow-lib';
import {StudyProgressComponent} from './study-progress.component';

describe('StudyProgressComponent', () => {
  let component: StudyProgressComponent;
  let fixture: ComponentFixture<StudyProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudyProgressComponent],
      imports: [
        RouterTestingModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyProgressComponent);
    component = fixture.componentInstance;
    component.study = mockStudy0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate percent complete', () => {
    component.study.categories.forEach(cat => cat.workflows.forEach(wf => wf.status = WorkflowStatus.COMPLETE));
    component.calculatePercentComplete();
    expect(component.percentComplete).toEqual(100);
  });
});
