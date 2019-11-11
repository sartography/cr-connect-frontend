import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Study} from '../../_models/study';
import {Study_type} from '../../_models/study_type';
import {Task} from '../../_models/task';
import {environment} from '../../environments/environment';
import {ConfigService} from '../config/config.service';

interface ApiError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRoot: string;
  public endpoints = {
    study: '/api/study/<id>',
    studyList: '/api/study',
    studyType: '/api/study_type/<id>',
    studyTypeList: '/api/study_type',
    task: '/api/task/<id>',
    taskList: '/api/task',
  };

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.apiRoot = configService.apiUrl;
  }

  /** Get Study */
  getStudy(id: number): Observable<Study> {
    return this.httpClient
      .get<Study>(this._endpointUrl('study').replace('<id>', id.toString()))
      .pipe(catchError(this._handleError));
  }

  /** Get Studies */
  getStudies(): Observable<Study[]> {
    return this.httpClient
      .get<Study[]>(this._endpointUrl('studyList'))
      .pipe(catchError(this._handleError));
  }

  /** Get Study Type */
  getStudyType(id: number): Observable<Study_type> {
    return this.httpClient
      .get<Study_type>(this._endpointUrl('studyType').replace('<id>', id.toString()))
      .pipe(catchError(this._handleError));
  }

  /** Get Study Types */
  getStudyTypes(): Observable<Study_type[]> {
    return this.httpClient
      .get<Study_type[]>(this._endpointUrl('studyTypeList'))
      .pipe(catchError(this._handleError));
  }

  /** Get Task */
  getTask(id: number): Observable<Task> {
    return this.httpClient
      .get<Task>(this._endpointUrl('task').replace('<id>', id.toString()))
      .pipe(catchError(this._handleError));
  }

  /** Get Tasks */
  getTasks(): Observable<Task[]> {
    return this.httpClient
      .get<Task[]>(this._endpointUrl('taskList'))
      .pipe(catchError(this._handleError));
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
}
