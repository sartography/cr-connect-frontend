import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

import { HelpWrapperComponent } from './help-wrapper.component';

describe('HelpWrapperComponent', () => {
  let component: HelpWrapperComponent;
  let fixture: ComponentFixture<HelpWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpWrapperComponent ],
      imports: [
        MatDialogModule,
        MatIconModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Happy Little Title',
            text: 'Just go out and talk to a tree. Make friends with it. There we go. Only God can make a tree - but you can paint one.'
          }
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
