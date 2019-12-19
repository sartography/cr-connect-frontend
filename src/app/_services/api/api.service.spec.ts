import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {mockStudyTask0, mockStudyTasks} from '../../_testing/mocks/study-task.mocks';
import {mockStudyTypes} from '../../_testing/mocks/study-type.mocks';
import {mockStudies} from '../../_testing/mocks/study.mocks';
import {mockTasks} from '../../_testing/mocks/task.mocks';
import {mockWorkflowSpecs} from '../../_testing/mocks/workflow-spec.mocks';
import {workflowProcesses} from '../../_testing/mocks/workflow.mocks';

import {ApiService} from './api.service';

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
  });

  afterEach(() => {
    const httpMock = TestBed.get(HttpTestingController);
    httpMock.verify();
  });

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });

  it('should rewrite dummy API URL to access static JSON assets directory', () => {
    const service: ApiService = TestBed.get(ApiService);
    const result: string = (service as any)._dummy_api_url('https://staging.whatever.com:5000/api/whatever');
    expect(result).toEqual('/assets/json/whatever.json');
  });

  it('should get studies', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getStudies().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].title).toEqual(mockStudies[0].title);
      expect(data[1].title).toEqual(mockStudies[1].title);
    });

    const req = httpMock.expectOne('/assets/json/study.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudies);
  });

  it('should get study types', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getStudyTypes().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].label).toEqual(mockStudyTypes[0].label);
      expect(data[1].label).toEqual(mockStudyTypes[1].label);
    });

    const req = httpMock.expectOne('/assets/json/study_type.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudyTypes);
  });

  it('should get tasks', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getTasks().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].label).toEqual(mockTasks[0].label);
      expect(data[1].label).toEqual(mockTasks[1].label);
    });

    const req = httpMock.expectOne('/assets/json/task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockTasks);
  });

  it('should get all study tasks for all studies', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getStudyTasks().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      data.forEach(s => expect(s.study_id).toBeDefined());
    });

    const req = httpMock.expectOne('/assets/json/study_task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudyTasks);
  });

  it('should get study tasks for a given study', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getStudyTasksForStudy('0').subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      data.forEach(s => expect(s.study_id).toEqual('0'));
    });

    const req = httpMock.expectOne('/assets/json/study_task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudyTasks);
  });

  it('should call real API URL for getStudyTasksForStudy when not in dummy mode', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.dummy = false;
    service.apiRoot = 'https://real-api-url.com';

    service.getStudyTasksForStudy('0').subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      data.forEach(s => expect(s.study_id).toEqual('0'));
    });

    const req = httpMock.expectOne('https://real-api-url.com/api/study_task/study/0');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudyTasks.filter(s => s.study_id === '0'));
  });

  it('should get one study', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyId = '0';

    service.getStudy(studyId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(studyId);
    });

    const req = httpMock.expectOne('/assets/json/study.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudies);
  });

  it('should get one task', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const taskId = '0';

    service.getTask(taskId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(taskId);
    });

    const req = httpMock.expectOne('/assets/json/task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockTasks);
  });

  it('should get one studyType', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyTypeId = '0';

    service.getStudyType(studyTypeId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(studyTypeId);
    });

    const req = httpMock.expectOne('/assets/json/study_type.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudyTypes);
  });

  it('should get one studyTask', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyTaskId = '0';

    service.getStudyTask(studyTaskId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(studyTaskId);
      expect(data.study_id).toEqual(mockStudyTask0.study_id);
      expect(data.task_id).toEqual(mockStudyTask0.task_id);
    });

    const req = httpMock.expectOne('/assets/json/study_task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudyTasks);
  });

  it('should get workflow specs', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getWorkflowSpecs().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].name).toEqual(mockWorkflowSpecs[0].name);
      expect(data[1].name).toEqual(mockWorkflowSpecs[1].name);
    });

    const req = httpMock.expectOne('/assets/json/workflow_spec.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockWorkflowSpecs);
  });

  it('should get workflow processes', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getWorkflowProcesses().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].name).toEqual(workflowProcesses[0].name);
    });

    const req = httpMock.expectOne('/assets/json/workflow_process.json');
    expect(req.request.method).toEqual('GET');
    req.flush(workflowProcesses);
  });

  it('should get one workflowProcess', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const workflowProcessId = '0';

    service.getWorkflowProcess(workflowProcessId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(workflowProcessId);
    });

    const req = httpMock.expectOne('/assets/json/workflow_process.json');
    expect(req.request.method).toEqual('GET');
    req.flush(workflowProcesses);
  });

  it('should call the real API URL for getStudyTask when not in dummy mode', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyTaskId = '0';

    service.dummy = false;
    service.apiRoot = 'https://real-api-url.com';

    service.getStudyTask(studyTaskId).subscribe(studyTask => {
      expect(studyTask).toBeTruthy();
      expect(studyTask.id).toEqual(studyTaskId);
      expect(studyTask.study_id).toEqual(mockStudyTask0.study_id);
      expect(studyTask.task_id).toEqual(mockStudyTask0.task_id);
    });

    const req = httpMock.expectOne('https://real-api-url.com/api/study_task/0');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudyTask0);
  });

  it('should return an error if an invalid ID is requested', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyTaskId = '666';
    let errorMessage = '';

    service.getStudyTask(studyTaskId).subscribe(data => {
      // Test should fail if this line runs.
      expect(false).toBeTruthy();
    }, error => {
      expect(error).toBeTruthy();
      errorMessage = error;
    });

    const req = httpMock.expectOne('/assets/json/study_task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockStudyTasks);
    expect(errorMessage).toEqual('Invalid ID');
  });

  it('should return an error if an invalid endpoint is requested', () => {
    const service: ApiService = TestBed.get(ApiService);
    service.dummy = false;
    expect(_ => (service as any)._endpointUrl('bogus_name')).toThrowError();
  });
});
