import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HighlightModule} from 'ngx-highlightjs';

import { CodeViewerComponent } from './code-viewer.component';

describe('CodeViewerComponent', () => {
  let component: CodeViewerComponent;
  let fixture: ComponentFixture<CodeViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CdkCopyToClipboard,
        CodeViewerComponent,
      ],
      imports: [
        HighlightModule,
        MatIconModule,
        MatSnackBarModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a confirmation message', () => {
    const snackBarSpy = spyOn((component as any).snackBar, 'open').and.stub();
    component.confirmCopy();
    expect(snackBarSpy).toHaveBeenCalled();
  });
});
