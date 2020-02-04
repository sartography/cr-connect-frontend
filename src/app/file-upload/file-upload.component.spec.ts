import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgxFileDropModule} from 'ngx-file-drop';
import {of} from 'rxjs';
import {ApiService, MockEnvironment, mockFileMetas, mockWorkflow0} from 'sartography-workflow-lib';
import {FileUploadComponent} from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let httpMock: HttpTestingController;

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
          HttpClientTestingModule,
        ],
        providers: [
          ApiService,
          {
            provide: ActivatedRoute,
            useValue: {paramMap: of(convertToParamMap({study_id: '0', workflow_id: '0', task_id: '0'}))},
          },
          {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        ]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(FileUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const wfReq = httpMock.expectOne('apiRoot/workflow/0');
        expect(wfReq.request.method).toEqual('GET');
        wfReq.flush(mockWorkflow0);
        expect((component as any).workflowId).toEqual(mockWorkflow0.id);

        const fmsReq = httpMock.expectOne('apiRoot/file?task_id=0');
        expect(fmsReq.request.method).toEqual('GET');
        fmsReq.flush(mockFileMetas);
        expect((component as any).fileMetas).toEqual(mockFileMetas);

        const fileArray = [];
        mockFileMetas.forEach((fm, i) => {
          const fReq = httpMock.expectOne(`apiRoot/file/${fm.id}/data`);
          expect(fReq.request.method).toEqual('GET');
          fReq.flush(mockFileMetas[i].file);
          fileArray.push(mockFileMetas[i].file);
        });

        expect(Array.from((component as any).files as Set<File>)).toEqual(fileArray);
      });
  }));

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
