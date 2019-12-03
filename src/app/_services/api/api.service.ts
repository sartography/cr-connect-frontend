import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {GenericType} from '../../_models/generic-type';
import {Study} from '../../_models/study';
import {StudyTask} from '../../_models/study-task';
import {StudyType} from '../../_models/study-type';
import {Task, TaskSpec} from '../../_models/task';
import {WorkflowSpec} from '../../_models/workflow';

export interface ApiError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public endpoints = {
    study: '/api/study/<id>',
    studyList: '/api/study',
    studyTask: '/api/study_task/<id>',
    studyTaskList: '/api/study_task',
    studyTaskListForStudy: '/api/study_task/study/<id>',
    studyType: '/api/study_type/<id>',
    studyTypeList: '/api/study_type',
    task: '/api/task/<id>',
    taskList: '/api/task',
    taskSpec: '/api/task_spec/<id>',
    taskSpecs: '/api/task_spec',
    taskSpecsForWorkflowSpec: '/api/task_spec/workflow_spec/<id>',
    workflowSpec: '/api/workflow_spec/<id>',
    workflowSpecList: '/api/workflow_spec',
  };
  apiRoot: string;
  dummy: boolean;

  constructor(
    private httpClient: HttpClient
  ) {
    this.apiRoot = environment.api;
    this.dummy = environment.dummy || false;
  }

  /** Get Study */
  getStudy(id: number): Observable<Study> {
    return this._getOne<Study>(id, 'study');
  }

  /** Get Studies */
  getStudies(): Observable<Study[]> {
    return this._getAll<Study>('study');
  }

  /** Get Study Task */
  getStudyTask(id: number): Observable<StudyTask> {
    return this._getOne<StudyTask>(id, 'studyTask');
  }

  /** Get Study Tasks for Study */
  getStudyTasksForStudy(id: number): Observable<StudyTask[]> {
    if (this.dummy) {
      return this.httpClient
        .get<StudyTask[]>(this._endpointUrl('studyTaskList'))
        .pipe(map(st => st.filter(s => s.study_id === id)))
        .pipe(catchError(this._handleError));
    } else {
      return this.httpClient
        .get<StudyTask[]>(this._endpointUrl('studyTaskListForStudy').replace('<id>', id.toString()))
        .pipe(catchError(this._handleError));
    }
  }

  /** Get Study Tasks */
  getStudyTasks(): Observable<StudyTask[]> {
    return this._getAll<StudyTask>('studyTask');
  }

  /** Get Study Type */
  getStudyType(id: number): Observable<StudyType> {
    return this._getOne<StudyType>(id, 'studyType');
  }

  /** Get Study Types */
  getStudyTypes(): Observable<StudyType[]> {
    return this._getAll<StudyType>('studyType');
  }

  /** Get Task */
  getTask(id: number): Observable<Task> {
    return this._getOne<Task>(id, 'task');
  }

  /** Get Tasks */
  getTasks(): Observable<Task[]> {
    return this._getAll<Task>('task');
  }

  /** Get TaskSpec */
  getTaskSpec(id: number): Observable<TaskSpec> {
    return this._getOne<TaskSpec>(id, 'taskSpec');
  }

  /** Get TaskSpecs */
  getTaskSpecs(): Observable<TaskSpec[]> {
    return this._getAll<TaskSpec>('taskSpecs');
  }

  /** Get WorkflowSpec */
  getWorkflowSpec(id: number): Observable<WorkflowSpec> {
    return this._getOne<WorkflowSpec>(id, 'workflowSpec');
  }

  /** Get WorkflowSpecs */
  getWorkflowSpecs(): Observable<WorkflowSpec[]> {
    return this._getAll<WorkflowSpec>('workflowSpec');
  }

  /** Get Task Specs for Workflow Spec */
  getTaskSpecsForWorkflowSpec(wf: WorkflowSpec): Observable<TaskSpec[]> {
    if (this.dummy) {
      return this.httpClient
        .get<TaskSpec[]>(this._endpointUrl('taskSpecs'))
        .pipe(map(ts => ts.filter(s => wf.task_spec_ids.includes(s.id))))
        .pipe(catchError(this._handleError));
    } else {
      return this.httpClient
        .get<TaskSpec[]>(this._endpointUrl('taskSpecsForWorkflowSpec').replace('<id>', wf.id.toString()))
        .pipe(catchError(this._handleError));
    }
  }

  private _handleError(error: ApiError) {
    return throwError(error.message || 'Could not complete your request; please try again later.');
  }

  private _endpointUrl(endpointName: string): string {
    const path = this.endpoints[endpointName];

    if (path) {
      if (this.dummy) {
        return this._dummy_api_url(path);
      } else {
        return this.apiRoot + path;
      }
    } else {
      throw new Error(`endpoint '${endpointName}' does not exist`);
    }
  }

  private _dummy_api_url(path: string) {
    if (path && path.search('/api/') !== -1) {
      const arr = path.split('/api/');
      if (arr.length > 0) {
        return `/assets/json/${arr[arr.length - 1]}.json`;
      }
    }
  }

  private _getOne<T extends GenericType>(id: number, endpointName: string): Observable<T> {
    if (this.dummy) {
      return this.httpClient
        .get<T[]>(this._endpointUrl(endpointName + 'List'))
        .pipe(
          map(results => {
            const found = results.find(t => t.id === id);
            if (!found) {
              const error: ApiError = {code: '404', message: 'Invalid ID'};
              throw error;
            } else {
              return found;
            }
          }),
          catchError(this._handleError)
        );
    } else {
      return this.httpClient
        .get<T>(this._endpointUrl(endpointName).replace('<id>', id.toString()))
        .pipe(catchError(this._handleError));
    }
  }

  private _getAll<T extends GenericType>(endpointName: string): Observable<T[]> {
    const url = this._endpointUrl(endpointName + 'List');
    return this.httpClient
      .get<T[]>(url)
      .pipe(catchError(this._handleError));
  }
}
