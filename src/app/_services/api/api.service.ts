import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Study} from '../../_models/study';
import {WorkflowTask} from '../../_models/workflow-task';
import {Workflow, WorkflowSpec} from '../../_models/workflow';

export interface ApiError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public endpoints = {
    studyList: '/v1.0/study',
    study: '/v1.0/study/<study_id>',
    workflowListForStudy: '/v1.0/study/<study_id>/workflows',
    studyStatus: '/v1.0/study-update/<study_id>',
    workflowSpecList: '/v1.0/workflow-specification',
    workflow: '/v1.0/workflow/<workflow_id>',
    taskForWorkflow: '/v1.0/workflow/<workflow_id>/task/<task_spec_name>',
    taskListForWorkflow: '/v1.0/workflow/<workflow_id>/tasks',
  };
  apiRoot: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.apiRoot = environment.api;
  }

  /** Add Workflow For Study */
  addStudy(study: Study): Observable<Study> {
    const url = this._endpointUrl('studyList');
    return this.httpClient
      .post<Study>(url, study)
      .pipe(catchError(this._handleError));
  }

  /** Add Workflow For Study */
  updateStudy(studyId: string, study: Study): Observable<Study> {
    const url = this._endpointUrl('study');
    return this.httpClient
      .post<Study>(url.replace('<study_id>', studyId), study)
      .pipe(catchError(this._handleError));
  }

  /** Add Workflow For Study */
  addWorkflowForStudy(studyId: number, workflowSpecId: string): Observable<Study> {
    const url = this._endpointUrl('workflowListForStudy');
    return this.httpClient
      .post<Study>(url.replace('<study_id>', studyId.toString()), {id: workflowSpecId})
      .pipe(catchError(this._handleError));
  }

  /** Get Studies */
  getStudies(): Observable<Study[]> {
    const url = this._endpointUrl('studyList');
    return this.httpClient
      .get<Study[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** Get Study */
  getStudy(studyId: number): Observable<Study> {
    const url = this._endpointUrl('study');
    return this.httpClient
      .get<Study>(url.replace('<study_id>', studyId.toString()))
      .pipe(catchError(this._handleError));
  }

  /** Get WorkflowListForStudy */
  getWorkflowListForStudy(studyId: number): Observable<Workflow[]> {
    const url = this._endpointUrl('workflowListForStudy');
    return this.httpClient
      .get<Workflow[]>(url.replace('<study_id>', studyId.toString()))
      .pipe(catchError(this._handleError));
  }

  /** Get StudyStatus */
  getStudyStatus(studyId: number): Observable<any> {
    const url = this._endpointUrl('studyStatus');
    return this.httpClient.get<any>(url.replace('<study_id>', studyId.toString()))
      .pipe(catchError(this._handleError));
  }

  /** Get WorkflowSpecList */
  getWorkflowSpecList(): Observable<WorkflowSpec[]> {
    const url = this._endpointUrl('workflowSpecList');
    return this.httpClient
      .get<WorkflowSpec[]>(url)
      .pipe(catchError(this._handleError));
  }

  /** Get Workflow */
  getWorkflow(workflowId: number): Observable<Workflow> {
    const url = this._endpointUrl('workflow');
    return this.httpClient
      .get<Workflow>(url.replace('<workflow_id>', workflowId.toString()))
      .pipe(catchError(this._handleError));
  }

  /** Get TaskForWorkflow */
  getTaskForWorkflow(workflowId: number, taskSpecName: string): Observable<WorkflowTask> {
    const url = this._endpointUrl('taskForWorkflow');
    const urlWithIds = url
      .replace('<workflow_id>', workflowId.toString())
      .replace('<task_spec_name>', taskSpecName.toString());
    return this.httpClient.get<WorkflowTask>(urlWithIds)
      .pipe(catchError(this._handleError));
  }

  /** Update TaskForWorkflow */
  updateTaskForWorkflow(workflowId: number, taskSpecName: string, data: any): Observable<WorkflowTask> {
    const url = this._endpointUrl('taskForWorkflow');
    const urlWithIds = url
      .replace('<workflow_id>', workflowId.toString())
      .replace('<task_spec_name>', taskSpecName.toString());
    return this.httpClient.put<WorkflowTask>(urlWithIds, data)
      .pipe(catchError(this._handleError));
  }

  /** Get TaskListForWorkflow */
  getTaskListForWorkflow(workflowId: number): Observable<WorkflowTask[]> {
    const url = this._endpointUrl('taskListForWorkflow');
    return this.httpClient
      .get<WorkflowTask[]>(url.replace('<workflow_id>', workflowId.toString()))
      .pipe(catchError(this._handleError));
  }

  private _handleError(error: ApiError) {
    return throwError(error.message || 'Could not complete your request; please try again later.');
  }

  private _endpointUrl(endpointName: string): string {
    const path = this.endpoints[endpointName];

    if (path) {
      return this.apiRoot + path;
    } else {
      throw new Error(`endpoint '${endpointName}' does not exist`);
    }
  }
}
