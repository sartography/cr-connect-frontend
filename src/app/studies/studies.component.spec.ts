import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService} from '../_services/api/api.service';
import {studies} from '../_services/api/api.service.spec';

import {StudiesComponent} from './studies.component';

describe('StudiesComponent', () => {
  let component: StudiesComponent;
  let fixture: ComponentFixture<StudiesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudiesComponent],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
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
    sReq.flush(studies);

    expect(component.draftStudies).toBeTruthy();
    expect(component.submittedStudies).toBeTruthy();
    expect(component.activeStudies).toBeTruthy();
    expect(component.inactiveStudies).toBeTruthy();
    expect(
      component.draftStudies.length +
      component.submittedStudies.length +
      component.activeStudies.length +
      component.inactiveStudies.length
    ).toEqual(studies.length);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
