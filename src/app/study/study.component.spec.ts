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
  MockEnvironment, mockFileMetas,
  mockStudy0,
  ProtocolBuilderStatus,
  ProtocolBuilderStatusLabels
} from 'sartography-workflow-lib';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {StudyComponent} from './study.component';

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
          useValue: {snapshot: {paramMap: convertToParamMap({study_id: '0'})}},
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
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

    const fReq = httpMock.expectOne('apiRoot/file?study_id=' + mockStudy0.id);
    expect(fReq.request.method).toEqual('GET');
    fReq.flush(mockFileMetas);
    expect(component.fileMetas).toEqual(mockFileMetas);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get status label', () => {
    expect(component.getStatusLabel(ProtocolBuilderStatus.ACTIVE))
      .toEqual(ProtocolBuilderStatusLabels.ACTIVE);
  });

  it('should check for workflows', () => {
    expect(component.allWorkflows.length).toBeGreaterThan(0);
  });

});
