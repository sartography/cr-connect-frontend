import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MarkdownModule} from 'ngx-markdown';

import {HelpDialogComponent} from './help-dialog.component';

describe('HelpDialogComponent', () => {
  let component: HelpDialogComponent;
  let fixture: ComponentFixture<HelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpDialogComponent],
      imports: [
        MarkdownModule.forRoot(),
        MatDialogModule
      ],
      providers: [
        {
          provide: MatDialogRef, useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {
          provide: MAT_DIALOG_DATA,
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

  it('should convert escaped line breaks', () => {
    expect(component.unescape('Un\\nescape\\r\\nme\nplease!')).toEqual('Un\nescape\nme\nplease!');
    expect(component.unescape('Un\\r\\nescape\\r\\nme\\r\\nplease!')).toEqual('Un\nescape\nme\nplease!');
    expect(component.unescape('But\nleave\nme\nalone.')).toEqual('But\nleave\nme\nalone.');
  });

  it('should close dialog', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith();
  });
});
