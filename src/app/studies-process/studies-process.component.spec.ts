import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudiesProcessComponent } from './studies-process.component';

describe('StudiesProcessComponent', () => {
  let component: StudiesProcessComponent;
  let fixture: ComponentFixture<StudiesProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiesProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiesProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
