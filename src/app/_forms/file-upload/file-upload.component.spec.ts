import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {FileSystemFileEntry, NgxFileDropEntry, NgxFileDropModule} from 'ngx-file-drop';
import {of} from 'rxjs';
import {ApiService, MockEnvironment, mockFileMeta0, mockFileMetas} from 'sartography-workflow-lib';
import {FileUploadComponent} from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatTableModule,
        NgxFileDropModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FileUploadComponent,
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
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.field = {key: 'hi'};
    fixture.detectChanges();

    const fmsReq = httpMock.expectOne('apiRoot/file?study_id=0&workflow_id=0&task_id=0&form_field_key=hi');
    expect(fmsReq.request.method).toEqual('GET');
    fmsReq.flush(mockFileMetas);

    mockFileMetas.forEach((fm, i) => {
      const fReq = httpMock.expectOne(`apiRoot/file/${fm.id}/data`);
      expect(fReq.request.method).toEqual('GET');
      fReq.flush(mockFileMetas[i].file);
    });

    expect((component as any).fileMetas).toEqual(new Set(mockFileMetas));
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle a dropped file', () => {
    const addFileSpy = spyOn(component, 'addFile').and.stub();
    const updateFileListSpy = spyOn(component, 'updateFileList').and.stub();
    const files: NgxFileDropEntry[] = mockFileMetas.map(fm => {
      const fileEntry: FileSystemFileEntry = {
        name: fm.name,
        isDirectory: false,
        isFile: true,
        file: (callback: (file: File) => void): void => {
          callback(fm.file);
        },
      };
      return new NgxFileDropEntry(fm.name, fileEntry);
    });

    component.dropped(files);

    mockFileMetas.forEach(fm => expect(addFileSpy).toHaveBeenCalledWith(fm.file));
    expect(updateFileListSpy).toHaveBeenCalled();
  });

  it('should highlight drop zone on hover', () => {
    expect(component.dropZoneHover).toEqual(false);

    component.fileOver(new Event('hover'));
    expect(component.dropZoneHover).toEqual(true);

    component.fileLeave(new Event('hover'));
    expect(component.dropZoneHover).toEqual(false);
  });

  it('should display file size in human-readable units', () => {

    // 1 kilobyte (K / Kb) = 2^10 bytes = 1,024 bytes
    expect(component.formatSize(128, 1)).toEqual('0.1 KB');
    expect(component.formatSize(128, 2)).toEqual('0.13 KB');
    expect(component.formatSize(128, 3)).toEqual('0.125 KB');
    expect(component.formatSize(1024, 3)).toEqual('1.000 KB');

    // 1 megabyte (M / MB) = 2^20 bytes = 1,048,576 bytes
    expect(component.formatSize(1048576, 3)).toEqual('1.000 MB');

    // 1 gigabyte (G / GB) = 2^30 bytes = 1,073,741,824 bytes
    expect(component.formatSize(1073741824, 3)).toEqual('1.000 GB');

    // 1 terabyte (T / TB) = 2^40 bytes = 1,099,511,627,776 bytes
    expect(component.formatSize(1099511627776, 3)).toEqual('1.000 TB');
  });

  it('should truncate long strings', () => {
    expect(component.truncate('1234567890ABCDEFG', 9)).toEqual('123456789...');
    expect(component.truncate('1234567890', 9)).toEqual('123456789...');
    expect(component.truncate('12345678', 9)).toEqual('12345678');
    expect(component.truncate('false', 9)).toEqual('false');
    expect(component.truncate(undefined, 9)).toEqual('');
    expect(component.truncate(null, 9)).toEqual('');
  });

  it('should add a file', () => {
    spyOn((component as any).api, 'addFileMeta').and.returnValue(of(mockFileMeta0));
    const updateFileListSpy = spyOn(component, 'updateFileList').and.stub();
    component.addFile(mockFileMeta0.file);
    expect(component.fileMetas.has(mockFileMeta0)).toEqual(true);
    expect(updateFileListSpy).toHaveBeenCalled();
  });

  it('should remove a file', () => {
    spyOn((component as any).api, 'deleteFileMeta').and.returnValue(of(null));
    const updateFileListSpy = spyOn(component, 'updateFileList').and.stub();
    component.fileMetas.add(mockFileMeta0);
    expect(component.fileMetas.has(mockFileMeta0)).toEqual(true);

    component.removeFile(new Event('click'), mockFileMeta0);
    expect(component.fileMetas.has(mockFileMeta0)).toEqual(false);
    expect(updateFileListSpy).toHaveBeenCalled();
  });
});

