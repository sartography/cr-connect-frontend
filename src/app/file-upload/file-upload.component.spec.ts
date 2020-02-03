import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgxFileDropModule} from 'ngx-file-drop';
import { FileUploadComponent } from './file-upload.component';
import { MatTableModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async(() => {

    TestBed
      .configureTestingModule({
        declarations: [FileUploadComponent],
        imports: [
          FormsModule,
          MatFormFieldModule,
          MatIconModule,
          MatTableModule,
          NgProgressModule,
          NgxFileDropModule,
          ReactiveFormsModule,
        ],
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FileUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
