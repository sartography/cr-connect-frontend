import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {RouterTestingModule} from '@angular/router/testing';
import {mockStudies} from '../_testing/mocks/study.mocks';

import { StudyCardComponent } from './study-card.component';

describe('StudyCardComponent', () => {
  let component: StudyCardComponent;
  let fixture: ComponentFixture<StudyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudyCardComponent
      ],
      imports: [
        MatCardModule,
        RouterTestingModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyCardComponent);
    component = fixture.componentInstance;
    component.study = mockStudies[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
