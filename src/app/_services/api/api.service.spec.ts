import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {ProtocolBuilderStatus, Study} from '../../_models/study';
import {StudyTask} from '../../_models/study-task';
import {StudyType} from '../../_models/study-type';
import {Task, TaskState} from '../../_models/task';
import {WorkflowProcess, WorkflowSpec} from '../../_models/workflow';

import {ApiService} from './api.service';

export const studies: Study[] = [
  {
    id: '0',
    ind_number: '12345',
    last_updated: new Date(),
    protocol_builder_status: ProtocolBuilderStatus.IN_PROCESS,
    primary_investigator_id: 'Dr. Tricia Marie McMillan',
    sponsor: 'Sirius Cybernetics Corporation',
    title: 'Phase III Trial of Genuine People Personalities (GPP) Autonomous Intelligent Emotional Agents for Interstellar Spacecraft',
  },
  {
    id: '1',
    ind_number: '12345',
    last_updated: new Date(),
    protocol_builder_status: ProtocolBuilderStatus.IN_PROCESS,
    primary_investigator_id: 'Dr. Slartibartfast Magrathean',
    sponsor: 'CamTim',
    title: 'Pilot Study of Fjord Placement for Single Fraction Outcomes to Cortisol Susceptibility',
  }
];

export const studyTypes: StudyType[] = [
  {id: '0', label: 'Expedited', task_ids: ['0']},
  {id: '1', label: 'Full Board', task_ids: ['0', '1']},
];

// TODO: Refactor this to be about TaskSpecs
export const tasks: Task[] = [
  {id: '0', label: 'Do the dishes', task_spec_id: '3', state_name: TaskState.Future},
  {id: '1', label: 'Take out the trash', task_spec_id: '2', state_name: TaskState.Future},
  {id: '2', label: 'Make the coffee', task_spec_id: '1', state_name: TaskState.Future},
  {id: '3', label: 'Do the monster mash', task_spec_id: '0', state_name: TaskState.Future},
];

// TODO: Refactor this to be about Task instances
export const studyTasks: StudyTask[] = [
  {id: '0', task_id: '0', study_id: '0', is_disabled: false, is_complete: true},
  {id: '1', task_id: '1', study_id: '0', is_disabled: true, is_complete: true},
  {id: '2', task_id: '2', study_id: '0', is_disabled: false, is_complete: false},
  {id: '3', task_id: '3', study_id: '0', is_disabled: true, is_complete: false},
  {id: '4', task_id: '0', study_id: '1', is_disabled: false, is_complete: true},
  {id: '5', task_id: '1', study_id: '1', is_disabled: true, is_complete: true},
  {id: '6', task_id: '2', study_id: '2', is_disabled: false, is_complete: false},
  {id: '7', task_id: '3', study_id: '2', is_disabled: true, is_complete: false},
];

// TODO: Add WorkflowSpecs and Workflows
export const workflowSpecs: WorkflowSpec[] = [
  {id: '0', name: 'Everything', description: 'Do all the things', task_spec_ids: ['0', '1', '2', '3']},
  {id: '1', name: 'Some things', description: 'Do a few things', task_spec_ids: ['0', '2', '3']},
  {id: '2', name: 'One thing', description: 'Do just one thing', task_spec_ids: ['1']},
];

export const workflowProcesses: WorkflowProcess[] = [
  {
    id: '0',
    name: 'Make a fantastic landscape',
    categories: [
      {
        id: '0',
        name: 'Let your imagination go wild',
        steps: [
          {
            id: '0',
            name: 'Let the paint work',
            form: {
              id: '0',
              name: 'Create a beautiful little sunset.',
              fields: [
                {
                  id: 'happyClouds',
                  type: 'string',
                  label: 'Happy Clouds',
                  properties: [
                    {id: 'description', value: 'Decide where your cloud lives.'},
                    {
                      id: 'help_text',
                      value: 'We don\'t want to set these clouds on fire. We\'ll play with clouds today.'
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

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

  it('should get all study tasks for all studies', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getStudyTasks().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      data.forEach(s => expect(s.study_id).toBeDefined());
    });

    const req = httpMock.expectOne('/assets/json/study_task.json');
    expect(req.request.method).toEqual('GET');
    req.flush(studyTasks);
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
    req.flush(studyTasks);
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
    req.flush(studyTasks.filter(s => s.study_id === '0'));
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
    req.flush(studies);
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
    req.flush(tasks);
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
    req.flush(studyTypes);
  });

  it('should get one studyTask', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);
    const studyTaskId = '0';

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

  it('should get workflow specs', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: ApiService = TestBed.get(ApiService);

    service.getWorkflowSpecs().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].name).toEqual(workflowSpecs[0].name);
      expect(data[1].name).toEqual(workflowSpecs[1].name);
    });

    const req = httpMock.expectOne('/assets/json/workflow_spec.json');
    expect(req.request.method).toEqual('GET');
    req.flush(workflowSpecs);
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

    service.getStudyTask(studyTaskId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.id).toEqual(studyTaskId);
      expect(data.study_id).toEqual(studyTasks[0].study_id);
      expect(data.task_id).toEqual(studyTasks[0].task_id);
    });

    const req = httpMock.expectOne('https://real-api-url.com/api/study_task/0');
    expect(req.request.method).toEqual('GET');
    req.flush(studyTasks[0]);
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
    req.flush(studyTasks);
    expect(errorMessage).toEqual('Invalid ID');
  });

  it('should return an error if an invalid endpoint is requested', () => {
    const service: ApiService = TestBed.get(ApiService);
    service.dummy = false;
    expect(_ => (service as any)._endpointUrl('bogus_name')).toThrowError();
  });
});
