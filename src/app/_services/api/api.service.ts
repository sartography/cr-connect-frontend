import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, filter, find, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {GenericType} from '../../_models/generic-type';
import {Study} from '../../_models/study';
import {StudyTask} from '../../_models/study-task';
import {StudyType} from '../../_models/study-type';
import {Task} from '../../_models/task';

interface ApiError {
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
  };
  private apiRoot: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.apiRoot = environment.api;
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
    if (environment.dummy) {
      return this.httpClient
        .get<StudyTask[]>(this._endpointUrl('studyTaskList'))
        .pipe(map(st => st.filter(s => s.study_id === id)))
        .pipe(catchError(this._handleError));
    } else {
      return this.httpClient
        .get<StudyTask[]>(this._endpointUrl('studyTasksForStudy').replace('<id>', id.toString()))
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

  private _handleError(error: ApiError) {
    let message = 'Could not complete your request; please try again later.';
    message = error.message;
    // return an observable with a user-facing error message
    return throwError(message);
  }

  private _endpointUrl(endpointName: string): string {
    const path = this.endpoints[endpointName];

    if (environment.dummy) {
      return this._dummy_api_url(path);
    } else if (path) {
      return this.apiRoot + path;
    } else {
      console.log(`endpoint '${endpointName}' does not exist`);
    }
  }

  private _dummy_api_url(path: string) {
    return path.replace(/^(.*)\/api\/(.*)$/, '/assets/json/$2.json');
  }

  private _getOne<T extends GenericType>(id: number, endpointName: string): Observable<T> {
    if (environment.dummy) {
      return this.httpClient
        .get<T[]>(this._endpointUrl(endpointName + 'List'))
        .pipe(map(results => results.find(t => t.id === id)))
        .pipe(catchError(this._handleError));
    } else {
      return this.httpClient
        .get<T>(this._endpointUrl(endpointName).replace('<id>', id.toString()))
        .pipe(catchError(this._handleError));
    }
  }

  private _getAll<T extends GenericType>(endpointName: string): Observable<T[]> {
    return this.httpClient
      .get<T[]>(this._endpointUrl(endpointName + 'List'))
      .pipe(catchError(this._handleError));
  }
}
