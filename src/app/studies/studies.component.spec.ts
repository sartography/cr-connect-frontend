import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment, mockStudies} from 'sartography-workflow-lib';
import {StudiesComponent} from './studies.component';

describe('StudiesComponent', () => {
  let component: StudiesComponent;
  let fixture: ComponentFixture<StudiesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudiesComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatDividerModule,
        MatIconModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
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
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(StudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/study');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockStudies);

    expect(component.studiesByStatus).toBeTruthy();

    const numStudies = component.studiesByStatus.reduce((memo, s) => memo + s.studies.length, 0);

    expect(numStudies).toEqual(mockStudies.length);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
