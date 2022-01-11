import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ApiService, TaskLogQuery} from 'sartography-workflow-lib';
import {TaskLogDataSource} from './task-logs-data-source';
import input from 'postcss/lib/input';
import {MatPaginator} from '@angular/material/paginator';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {MatSort} from '@angular/material/sort';
import {fromEvent, merge} from 'rxjs';

@Component({
  selector: 'app-task-logs',
  templateUrl: './task-logs.component.html',
  styleUrls: ['./task-logs.component.scss']
})
export class TaskLogsComponent implements OnInit, AfterViewInit {

  // This determines the columns in our table, and their order.
  displayedColumns = ["level", "code", "message", "workflow_id",
  "user_uid", "timestamp"];
  dataSource: TaskLogDataSource;
  query: TaskLogQuery;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('level') filter_level: ElementRef;
  @ViewChild('code') filter_code: ElementRef;
  @ViewChild('user') filter_user: ElementRef;

  @Input()
  studyId: number;

  constructor(private apiService: ApiService) { }


  ngOnInit(): void {
    this.dataSource = new TaskLogDataSource(this.apiService);
    this.dataSource.loadTaskLogs(this.studyId, {items:[], pages:0, page:0, total: 0, per_page: 10});
    this.dataSource.query$.subscribe(q => {
      this.query = q;
    })
  }

  ngAfterViewInit() {

    // server-side search
    let code_change = fromEvent(this.filter_code.nativeElement,'keyup');
    let label_change = fromEvent(this.filter_level.nativeElement,'keyup');
    let user_change = fromEvent(this.filter_user.nativeElement,'keyup');


    merge(code_change, label_change, user_change)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadLessonsPage();
        })
      )
      .subscribe();


    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadLessonsPage())
      )
      .subscribe();
  }

  loadLessonsPage() {
    this.query.code = this.filter_code.nativeElement.value;
    this.query.level = this.filter_level.nativeElement.value;
    this.query.user = this.filter_user.nativeElement.value;
    this.query.per_page = this.paginator.pageSize;
    this.query.page = this.paginator.pageIndex;
    this.query.sort_column = this.sort.active;
    this.query.sort_reverse = this.sort.direction === "desc";
    this.dataSource.loadTaskLogs(this.studyId, this.query);
  }

}

