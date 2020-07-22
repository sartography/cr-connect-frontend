import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {
  ApiService,
  MockEnvironment,
  mockStudies,
  mockStudy0,
  mockWorkflow0,
  ProtocolBuilderStatus,
  ProtocolBuilderStatusLabels,
  TaskAction,
  TaskEvent,
  WorkflowMetadata,
  WorkflowState,
  WorkflowStatus,
  WorkflowTaskState,
  WorkflowTaskType
} from 'sartography-workflow-lib';
import {StudyProgressComponent} from '../study-progress/study-progress.component';
import {StudiesDashboardComponent} from './studies-dashboard.component';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {StudyAction} from '../_interfaces/study-action';

describe('StudiesDashboardComponent', () => {
  let component: StudiesDashboardComponent;
  let fixture: ComponentFixture<StudiesDashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudyProgressComponent,
        StudiesDashboardComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatChipsModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatTooltipModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
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

    const sReq = httpMock.expectOne('apiRoot/task_events?action=ASSIGNMENT');
    expect(sReq.request.method).toEqual('GET');
    const mockWorkflowMetadata: WorkflowMetadata = {
      state: WorkflowState.REQUIRED,
      completed_tasks: 0,
      total_tasks: 0,
      category_id: 0,
      description: `It is a tale told by an idiot, full of sound and fury, signifying nothing.`,
      display_name: 'A Poor Player',
      name: 'walking_shadow',
      id: 0,
      category_display_name: 'Life',
      status: WorkflowStatus.USER_INPUT_REQUIRED,
      display_order: null,
    };

    const mockTaskEvent: TaskEvent = {
      id: 1,
      study: mockStudy0,
      workflow: mockWorkflowMetadata,
      user_uid: 'macbeth',
      action: TaskAction.ASSIGNMENT,
      task_id: 'tomorrow-and-tomorrow-and-tomorrow',
      task_title: 'Light Fools the Way to Dusty Death',
      task_name: 'out_out_brief_candle',
      task_type: WorkflowTaskType.USER_TASK,
      task_state: WorkflowTaskState.READY,
      task_lane: 'supervisor',
    };
    sReq.flush([mockTaskEvent]);

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
    expect(component.isNewStudy(mockStudy0.id)).toBeFalsy();
    expect(component.isNewStudy(666)).toBeTruthy();
  });
});
