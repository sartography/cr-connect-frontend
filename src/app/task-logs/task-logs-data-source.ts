import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ApiService, TaskLog, TaskLogQuery} from 'sartography-workflow-lib';
import {catchError, finalize} from 'rxjs/operators';


export class TaskLogDataSource implements DataSource<TaskLog> {

  private defaultQuery = {items:[], pages:0, page:0, total: 0, per_page: 10}
  private logsSubject = new BehaviorSubject<TaskLog[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private querySubject = new BehaviorSubject<TaskLogQuery>(this.defaultQuery);

  private taskLogQuery$ = this.loadingSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public query$ = this.querySubject.asObservable();

  constructor(private api: ApiService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<TaskLog[]> {
    return this.logsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.logsSubject.complete();
    this.loadingSubject.complete();
    this.querySubject.complete();
  }

  loadTaskLogs(study_id: number, taskQuery: TaskLogQuery) {
    this.loadingSubject.next(true);
    taskQuery.items = []; // Don't send back the query items, that's a waste of time and bandwidth.
    this.api.getStudyLogs(study_id, taskQuery).pipe(
      catchError(() => of(this.defaultQuery)),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(query => {
          this.querySubject.next(query);
          this.logsSubject.next(query.items)
        }
      );
  }
}
