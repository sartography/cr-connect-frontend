import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {RouterTestingModule} from '@angular/router/testing';
import {mockStudies} from '../_testing/mocks/study.mocks';
import {ApiService} from '../_services/api/api.service';
import {StudyCardComponent} from '../study-card/study-card.component';

import {StudiesComponent} from './studies.component';

describe('StudiesComponent', () => {
  let component: StudiesComponent;
  let fixture: ComponentFixture<StudiesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudiesComponent,
        StudyCardComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatProgressBarModule,
        RouterTestingModule,
      ],
      providers: [ApiService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(StudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('/assets/json/study.json');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockStudies);

    expect(component.studiesByStatus).toBeTruthy();

    const numStudies = component.studiesByStatus.reduce((memo, s) => {
      return memo + s.studies.length;
    }, 0);

    expect(numStudies).toEqual(mockStudies.length);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
