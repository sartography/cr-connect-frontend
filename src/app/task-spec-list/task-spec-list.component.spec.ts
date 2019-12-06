import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatListModule} from '@angular/material/list';
import {ApiService} from '../_services/api/api.service';

import { TaskSpecListComponent } from './task-spec-list.component';

describe('TaskSpecListComponent', () => {
  let component: TaskSpecListComponent;
  let fixture: ComponentFixture<TaskSpecListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSpecListComponent ],
      imports: [
        HttpClientTestingModule,
        MatListModule,
      ],
      providers: [ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(TaskSpecListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
