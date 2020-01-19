import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ChartsModule} from 'ng2-charts';
import {ApiService, MockEnvironment, mockStudy0} from 'sartography-workflow-lib';
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
        ChartsModule,
        HttpClientTestingModule,
        MatIconModule,
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
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(StudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/study/0');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockStudy0);

    expect(component.study).toBeTruthy();
    expect(component.study.id).toEqual(mockStudy0.id);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
