import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, find} from 'rxjs/operators';
import {GenericType} from '../../_models/generic_type';
import {Study} from '../../_models/study';
import {StudyType} from '../../_models/study_type';
import {Task} from '../../_models/task';
import {ConfigService} from '../config/config.service';

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
    studyType: '/api/study_type/<id>',
    studyTypeList: '/api/study_type',
    task: '/api/task/<id>',
    taskList: '/api/task',
  };
  private apiRoot: string;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.apiRoot = configService.apiUrl;
  }

  /** Get Study */
  getStudy(id: number): Observable<Study> {
    return this._getOne<Study>(id, 'study');
  }

  /** Get Studies */
  getStudies(): Observable<Study[]> {
    return this._getAll<Study>('study');
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

    if (this.configService.dummy) {
      return this._dummy_api_url(path);
    } else if (path) {
      return this.apiRoot + path;
    } else {
      console.log(`endpoint '${endpointName}' does not exist`);
    }
  }

  private _dummy_api_url(path: string) {
    return path.replace(/^(.*)\/api\/(.*)$/, './assets/json/$2.json');
  }

  private _getOne<T extends GenericType>(id: number, endpointName: string): Observable<T> {
    if (this.configService.dummy) {
      return this.httpClient
        .get<T>(this._endpointUrl(endpointName + 'List'))
        .pipe(find(t => t.id === id))
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
