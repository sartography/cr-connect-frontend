import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {FormlyModule} from '@ngx-formly/core';
import {of} from 'rxjs';
import {ApiService, MockEnvironment, mockFileMeta0} from 'sartography-workflow-lib';
import {FileFieldComponent} from './file-field.component';

describe('FileFieldComponent', () => {
  let component: FileFieldComponent;
  let fixture: ComponentFixture<FileFieldComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormlyModule,
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      declarations: [FileFieldComponent],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0', workflow_id: '0', task_id: '0'}))},
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(FileFieldComponent);
    component = fixture.componentInstance;
    component.field = {key: 'hi'};
    fixture.detectChanges();

    const fmsReq = httpMock.expectOne('apiRoot/file?study_id=0&workflow_id=0&task_id=0&form_field_key=hi');
    expect(fmsReq.request.method).toEqual('GET');
    fmsReq.flush([mockFileMeta0]);

    const fReq = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}/data`);
    expect(fReq.request.method).toEqual('GET');
    fReq.flush(mockFileMeta0.file);

    expect(component.selectedFile).toEqual(mockFileMeta0.file);
    expect(component.selectedFileMeta).toEqual(mockFileMeta0);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a file', () => {
    const addFileSpy = spyOn(component, 'addFile').and.stub();
    const eventWithFile = {target: {files: [mockFileMeta0.file]}};
    (component as any).onFileSelected(eventWithFile);
    expect(component.selectedFile).toEqual(mockFileMeta0.file);
    expect(addFileSpy).toHaveBeenCalledWith(mockFileMeta0.file);

    // Should get file from selectedFileMeta if it's not in the file field
    addFileSpy.calls.reset();
    component.selectedFile = undefined;
    component.selectedFileMeta = mockFileMeta0;
    const eventNoFile = {target: {files: []}};
    (component as any).onFileSelected(eventNoFile);
    expect(component.selectedFile).toEqual(mockFileMeta0.file);
    expect(addFileSpy).not.toHaveBeenCalled();
  });

  it('should add a file', () => {
    spyOn((component as any).api, 'addFileMeta').and.returnValue(of(mockFileMeta0));
    const loadFilesSpy = spyOn(component, 'loadFiles').and.stub();
    component.addFile(mockFileMeta0.file);
    expect(component.selectedFile).toEqual(mockFileMeta0.file);
    expect(component.selectedFileMeta).toEqual(mockFileMeta0);
    expect(loadFilesSpy).toHaveBeenCalled();
  });

  it('should remove a file', () => {
    spyOn((component as any).api, 'deleteFileMeta').and.returnValue(of(null));
    const loadFilesSpy = spyOn(component, 'loadFiles').and.stub();
    component.selectedFileMeta = mockFileMeta0;
    component.selectedFile = mockFileMeta0.file;

    component.removeFile();
    expect(component.selectedFileMeta).toBeUndefined();
    expect(component.selectedFile).toBeUndefined();
    expect(loadFilesSpy).toHaveBeenCalled();
  });
});
