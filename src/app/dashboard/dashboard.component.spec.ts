import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {RouterTestingModule} from '@angular/router/testing';
import {ChartsModule} from 'ng2-charts';
import {ApiService} from '../_services/api/api.service';
import {mockStudies, mockStudy0} from '../_testing/mocks/study.mocks';
import {mockWorkflows} from '../_testing/mocks/workflow.mocks';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        RouterTestingModule,
        ChartsModule,
      ],
      providers: [ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.study = mockStudies[0];
    fixture.detectChanges();

    const sReq = httpMock.expectOne(`http://localhost:5000/v1.0/study/${mockStudy0.id}/workflows`);
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockWorkflows);

    expect(component.workflows).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
