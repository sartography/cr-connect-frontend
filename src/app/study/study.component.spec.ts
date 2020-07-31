import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ChartsModule} from 'ng2-charts';
import {
  ApiService,
  MockEnvironment,
  mockFileMetas,
  mockStudy0,
  StudyStatus,
  StudyStatusLabels
} from 'sartography-workflow-lib';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {StudyComponent} from './study.component';
import {of} from 'rxjs';

describe('StudyComponent', () => {
  let component: StudyComponent;
  let fixture: ComponentFixture<StudyComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        StudyComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        ChartsModule,
        HttpClientTestingModule,
        MatDividerModule,
        MatIconModule,
        MatSidenavModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0'}))},
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(StudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/study/0');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockStudy0);
    expect(component.study).toBeTruthy();
    expect(component.study.id).toEqual(mockStudy0.id);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get status label', () => {
    expect(component.getStatusLabel(StudyStatus.IN_PROGRESS))
      .toEqual(StudyStatusLabels.IN_PROGRESS);
  });

  it('should check for workflows', () => {
    expect(component.allWorkflows.length).toBeGreaterThan(0);
  });

});
