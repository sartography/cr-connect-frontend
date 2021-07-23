import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockStudies,
  mockStudy0,
  mockTaskEvents,
  StudyStatus,
  StudyStatusLabels,
  mockUser0,
} from 'sartography-workflow-lib';
import {ConfirmStudyStatusDialogData} from '../_interfaces/dialog-data';
import {StudyAction} from '../_interfaces/study-action';
import {StudyProgressComponent} from '../study-progress/study-progress.component';
import {StudiesDashboardComponent} from './studies-dashboard.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ReviewProgressComponent} from '../review-progress/review-progress.component';
import {MatCard, MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';

describe('StudiesDashboardComponent', () => {
  let component: StudiesDashboardComponent;
  let fixture: ComponentFixture<StudiesDashboardComponent>;
  let httpMock: HttpTestingController;

  const mockStudyAction: StudyAction = {
    showIf: (study) => this.statusIs(study, [StudyStatus.IN_PROGRESS]),
    buttonIcon: 'pause',
    buttonLabel: 'Place study on hold...',
    tooltipText: 'Set the status of <study_title> to "Hold"',
    dialogTitle: 'Really put <study_title> on hold?',
    dialogDescription: `This will put the study on hold, pausing notifications and approvals for the time being. You may take the study off hold at any time.`,
    method: (study) => {
      study.status = StudyStatus.HOLD;
      return study;
    },
  };

  const mockConfirmDeleteData: ConfirmStudyStatusDialogData = {
    action: mockStudyAction,
    study: mockStudy0,
    confirm: false,
    formFields: [],
    model: {},
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudyProgressComponent,
        StudiesDashboardComponent,
        ReviewProgressComponent
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatButtonToggleModule,
        MatCardModule,
        MatChipsModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatTooltipModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MatPaginatorModule,
        MatBadgeModule
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    localStorage.removeItem('admin_view_as')
    localStorage.setItem('token','whatevervalueyouwant')
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(StudiesDashboardComponent);
    component = fixture.componentInstance;

    component.studiesByStatus = Object.keys(StudyStatus).map(statusKey => {
      return {
        status: StudyStatus[statusKey],
        statusLabel: StudyStatusLabels[statusKey],
        studies: mockStudies,
        dataSource: new MatTableDataSource(mockStudies),
      };
    });
    component.beforeStudyIds = mockStudies.map(study => study.id);
    component.afterStudyIds = mockStudies.map(study => study.id);
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/task_events?action=ASSIGNMENT');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockTaskEvents);
    const userReq = httpMock.expectOne('apiRoot/user');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser0);

    expect(component.approvalsDataSource).toBeTruthy();
    expect(component.approvalsDataSource.data).toBeTruthy();
    expect(component.approvalsDataSource.data.length).toBeGreaterThan(0);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check for new studies', () => {
    expect(component.isNewStudy(mockStudy0)).toBeFalsy();
  });

  it('should show a confirmation dialog before changing study status', () => {
    const _updateStudySpy = spyOn((component as any), '_updateStudy').and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockConfirmDeleteData)} as any);

    mockConfirmDeleteData.confirm = false;
    component.openConfirmationDialog(mockStudy0, component.studyActions[0]);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_updateStudySpy).not.toHaveBeenCalled();

    mockConfirmDeleteData.confirm = true;
    component.openConfirmationDialog(mockStudy0, component.studyActions[0]);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_updateStudySpy).toHaveBeenCalled();

    mockConfirmDeleteData.confirm = false;
  });

  it('should update study status', () => {
    const studyUpdatedEmitSpy = spyOn((component as any).studyUpdated, 'emit').and.stub();
    mockConfirmDeleteData.confirm = true;
    (component as any)._updateStudy(mockConfirmDeleteData);
    const wfsReq = httpMock.expectOne(`apiRoot/study/${mockStudy0.id}`);
    expect(wfsReq.request.method).toEqual('PUT');
    wfsReq.flush(mockStudy0);

    expect(studyUpdatedEmitSpy).toHaveBeenCalled();
  });

  it('should toggle task lane', () => {
    expect(component.taskLanes).toBeDefined();
    expect(component.taskLanes.length).toBeGreaterThan(1);

    for (const taskLane of component.taskLanes) {
      component.toggleTaskLane(new MatButtonToggleChange(null, taskLane));
      expect(component.selectedTaskLane).toEqual(taskLane);
      expect(component.approvalsDataSource.filter).toEqual(taskLane.label);
      expect(component.numTasksInTaskLane(taskLane)).toBeGreaterThan(0);
    }
  });
});
