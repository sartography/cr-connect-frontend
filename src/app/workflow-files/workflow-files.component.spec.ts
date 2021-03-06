import {APP_BASE_HREF} from '@angular/common';
import {HttpHeaders} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockFileMeta0,
  mockFileMeta1,
  mockFileMetas,
  mockWorkflow0
} from 'sartography-workflow-lib';

import {WorkflowFilesComponent} from './workflow-files.component';

describe('WorkflowFilesComponent', () => {
  let component: WorkflowFilesComponent;
  let fixture: ComponentFixture<WorkflowFilesComponent>;
  let httpMock: HttpTestingController;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatListModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
      ],
      declarations: [
        WorkflowFilesComponent,
      ],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0', workflow_id: '0', task_id: '0'}))}
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useValue: mockRouter},
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowFilesComponent);
    component = fixture.componentInstance;
    component.workflow = mockWorkflow0;
    component.fileMetas = mockFileMetas;
    fixture.detectChanges();
    expect(component.fileMetas).toEqual(mockFileMetas);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update file list on change', () => {
    component.fileMetas = mockFileMetas;
    expect(component.fileMetas).toEqual(mockFileMetas);
  });

  it('should download file', () => {

    // Firefox & Chrome
    component.downloadFile(mockFileMeta0);

    const f1Req = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}/data`);
    const f1ReqHeaders = new HttpHeaders()
      .append('last-modified', mockFileMeta0.file.lastModified.toString())
      .append('content-type', mockFileMeta0.file.type);
    f1Req.flush(new ArrayBuffer(8), {headers: f1ReqHeaders});
    expect(f1Req.request.method).toEqual('GET');

    // IE
    window.navigator.msSaveOrOpenBlob = () => true;
    const msSaveOrOpenBlobSpy = spyOn(window.navigator, 'msSaveOrOpenBlob').and.stub();
    component.downloadFile(mockFileMeta1);

    const f2Req = httpMock.expectOne(`apiRoot/file/${mockFileMeta1.id}/data`);
    const f2ReqHeaders = new HttpHeaders()
      .append('last-modified', mockFileMeta1.file.lastModified.toString())
      .append('content-type', mockFileMeta1.file.type);
    f2Req.flush(new ArrayBuffer(8), {headers: f2ReqHeaders});
    expect(f2Req.request.method).toEqual('GET');
    expect(msSaveOrOpenBlobSpy).toHaveBeenCalled();

  });
});
