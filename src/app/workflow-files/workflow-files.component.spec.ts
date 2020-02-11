import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatListModule,
        MatProgressSpinnerModule,
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
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowFilesComponent);
    component = fixture.componentInstance;
    component.workflow = mockWorkflow0;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/file?workflow_id=' + mockWorkflow0.id);
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockFileMetas);
    expect(component.fileMetas).toEqual(mockFileMetas);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update file list on change', () => {
    component.ngOnChanges();

    const sReq = httpMock.expectOne('apiRoot/file?workflow_id=' + mockWorkflow0.id);
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockFileMetas);
    expect(component.fileMetas).toEqual(mockFileMetas);
  });

  it('should download file', () => {

    // Firefox & Chrome
    component.downloadFile(mockFileMeta0);

    const f1Req = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}/data`);
    expect(f1Req.request.method).toEqual('GET');
    f1Req.flush(mockFileMeta0.file);

    // IE
    window.navigator.msSaveOrOpenBlob = () => true;
    const msSaveOrOpenBlobSpy = spyOn(window.navigator, 'msSaveOrOpenBlob').and.stub();
    component.downloadFile(mockFileMeta1);

    const f2Req = httpMock.expectOne(`apiRoot/file/${mockFileMeta1.id}/data`);
    expect(f2Req.request.method).toEqual('GET');
    f2Req.flush(mockFileMeta1.file);
    expect(msSaveOrOpenBlobSpy).toHaveBeenCalled();

  });
});
