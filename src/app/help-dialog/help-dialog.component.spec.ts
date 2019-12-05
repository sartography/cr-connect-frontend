import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import {HelpDialogComponent} from './help-dialog.component';

describe('HelpDialogComponent', () => {
  let component: HelpDialogComponent;
  let fixture: ComponentFixture<HelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpDialogComponent],
      imports: [
        MatDialogModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Happy Little Title',
            text: 'Just go out and talk to a tree. Make friends with it. There we go. Only God can make a tree - but you can paint one.'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
