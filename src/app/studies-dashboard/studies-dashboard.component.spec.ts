import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  mockStudies,
  mockStudy0,
  ProtocolBuilderStatus,
  ProtocolBuilderStatusLabels,
  Study
} from 'sartography-workflow-lib';
import {StudyProgressComponent} from '../study-progress/study-progress.component';

import { StudiesDashboardComponent } from './studies-dashboard.component';

describe('StudiesDashboardComponent', () => {
  let component: StudiesDashboardComponent;
  let fixture: ComponentFixture<StudiesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudyProgressComponent,
        StudiesDashboardComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        MatChipsModule,
        MatExpansionModule,
        MatTableModule,
        NoopAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiesDashboardComponent);
    component = fixture.componentInstance;
    component.studiesByStatus = Object.keys(ProtocolBuilderStatus).map(statusKey => {
      return {
        status: ProtocolBuilderStatus[statusKey],
        statusLabel: ProtocolBuilderStatusLabels[statusKey],
        studies: mockStudies,
        dataSource: new MatTableDataSource(mockStudies),
      };
    });
    component.beforeStudyIds = mockStudies.map(study => study.id);
    component.afterStudyIds = mockStudies.map(study => study.id);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check for new studies', () => {
    expect(component.isNewStudy(mockStudy0.id)).toBeFalsy();
    expect(component.isNewStudy(666)).toBeTruthy();
  });
});
