import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Study} from '../../_models/study';
import {StudyTask} from '../../_models/study-task';
import {StudyType} from '../../_models/study-type';
import {Task} from '../../_models/task';

import {ApiService} from './api.service';

describe('ApiService', () => {
  const studies: Study[] = [
    {id: 0, title: 'Study A', type_id: 3},
    {id: 1, title: 'Study B', type_id: 2},
  ];

  const studyTypes: StudyType[] = [
    {id: 0, label: 'Expedited', task_ids: [0]},
    {id: 1, label: 'Full Board', task_ids: [0, 1]},
  ];

  const tasks: Task[] = [
    {id: 0, label: 'Do the dishes'},
    {id: 1, label: 'Take out the trash'},
  ];

  const studyTasks: StudyTask[] = [
    {id: 0, task_id: 0, study_id: 0, is_disabled: false, is_complete: true},
    {id: 1, task_id: 1, study_id: 0, is_disabled: true, is_complete: true},
    {id: 2, task_id: 2, study_id: 0, is_disabled: false, is_complete: false},
    {id: 3, task_id: 3, study_id: 0, is_disabled: true, is_complete: false},
    {id: 4, task_id: 0, study_id: 1, is_disabled: false, is_complete: true},
    {id: 5, task_id: 1, study_id: 1, is_disabled: true, is_complete: true},
    {id: 6, task_id: 2, study_id: 2, is_disabled: false, is_complete: false},
    {id: 7, task_id: 3, study_id: 2, is_disabled: true, is_complete: false},
  ];

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
      expect(data[0].title).toEqual(studies[0].title);
      expect(data[1].title).toEqual(studies[1].title);
    });

    const req = httpMock.expectOne('/assets/json/study.json');
    expect(req.request.method).toEqual('GET');
    req.flush(studies);
  });

  it('should get study types', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getStudyTypes().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].label).toEqual(studyTypes[0].label);
      expect(data[1].label).toEqual(studyTypes[1].label);
    });

    const req = httpMock.expectOne('/assets/json/study_type.json');
    expect(req.request.method).toEqual('GET');
    req.flush(studyTypes);
  });

  it('should get tasks', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getTasks().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].label).toEqual(tasks[0].label);
      expect(data[1].label).toEqual(tasks[1].label);
    });

    const req = httpMock.expectOne('/assets/json/task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(tasks);
  });

  it('should get study tasks for a given study', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getStudyTasksForStudy(0).subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      data.forEach(s => expect(s.study_id).toEqual(0));
   });

    const req = httpMock.expectOne('/assets/json/study_task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(studyTasks);
  });

  it('should get one study', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyId = 0;

    service.getStudy(studyId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(studyId);
    });

    const req = httpMock.expectOne('/assets/json/study.json');
    expect(req.request.method).toEqual('GET');
    req.flush(studies);
  });

  it('should get one task', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const taskId = 0;

    service.getTask(taskId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(taskId);
    });

    const req = httpMock.expectOne('/assets/json/task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(tasks);
  });

  it('should get one studyType', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyTypeId = 0;

    service.getStudyType(studyTypeId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(studyTypeId);
    });

    const req = httpMock.expectOne('/assets/json/study_type.json');
    expect(req.request.method).toEqual('GET');
    req.flush(studyTypes);
  });

  it('should get one studyTask', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyTaskId = 0;

    service.getStudyTask(studyTaskId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(studyTaskId);
      expect(data.study_id).toEqual(studyTasks[0].study_id);
      expect(data.task_id).toEqual(studyTasks[0].task_id);
    });

    const req = httpMock.expectOne('/assets/json/study_task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(studyTasks);
  });
});
