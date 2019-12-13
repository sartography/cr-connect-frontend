import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ChartsModule} from 'ng2-charts';
import {ApiService} from '../_services/api/api.service';
import {studies} from '../_services/api/api.service.spec';
import {DashboardComponent} from '../dashboard/dashboard.component';

import { StudyComponent } from './study.component';

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
          useValue: {snapshot: {paramMap: convertToParamMap({study_id: '0'})}}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(StudyComponent);
    component = fixture.componentInstance;
    component.study = studies[0];
    fixture.detectChanges();

    const sReq = httpMock.expectOne('/assets/json/study.json');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(studies);

    expect(component.study).toBeTruthy();
    expect(component.study.id).toEqual(studies[0].id);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
