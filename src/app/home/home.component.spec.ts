import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {StudyTask} from '../_models/study-task';
import {Task} from '../_models/task';
import {ApiService} from '../_services/api/api.service';
import {studyTasks, tasks, studies, studyTypes} from '../_services/api/api.service.spec';

import {HomeComponent} from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatToolbarModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [ApiService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('/assets/json/study.json');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(studies);

    const stReq = httpMock.expectOne('/assets/json/study_type.json');
    expect(stReq.request.method).toEqual('GET');
    stReq.flush(studyTypes);

    expect(component.studies).toBeTruthy();
    expect(component.studies.length).toEqual(studies.length);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load study tasks', () => {
    const service: ApiService = TestBed.get(ApiService);
    const study = studies[0];
    const filteredStudyTasks: StudyTask[] = studyTasks.filter(st => st.study_id === study.id);
    expect(service).toBeTruthy();

    component.loadStudyTasks(study);
    const stReq = httpMock.expectOne('/assets/json/study_task.json');
    expect(stReq.request.method).toEqual('GET');
    stReq.flush(filteredStudyTasks);

    expect(component.selectedStudy).toBeTruthy();
    expect(component.selectedStudy.title).toEqual(study.title);
    expect(component.studyTasks).toBeTruthy();
    expect(component.studyTasks.length).toEqual(filteredStudyTasks.length);
    expect(component.tasks).toBeTruthy();
    expect(component.tasks.length).toEqual(0);

    const filteredTasks: Task[] = component.studyTasks.map(st => tasks.find(t => t.id === st.task_id));
    const taskReqs: TestRequest[] = httpMock.match('/assets/json/task.json');
    expect(taskReqs.length).toEqual(component.studyTasks.length);
    taskReqs.forEach((taskReq, i) => {
      expect(taskReq.request.method).toEqual('GET');
      taskReq.flush(filteredTasks);
    });

    expect(component.tasks).toBeTruthy();
    expect(component.tasks.length).toEqual(filteredTasks.length);
  });

  it('should return the disabled state of a given task', () => {
    const task = tasks[0];
    const study = studies[0];
    const studyTask = studyTasks.find(st => (task.id === st.task_id) && (st.study_id === study.id));
    component.studyTasks = studyTasks.filter(st => (task.id === st.task_id) && (st.study_id === study.id));
    const isDisabled = component.isDisabled(tasks[0]);
    expect(isDisabled).toEqual(studyTask.is_disabled);
  });

  it('should return the completed state of a given task', () => {
    const task = tasks[0];
    const study = studies[0];
    const studyTask = studyTasks.find(st => (task.id === st.task_id) && (st.study_id === study.id));
    component.studyTasks = studyTasks.filter(st => (task.id === st.task_id) && (st.study_id === study.id));
    const isComplete = component.isComplete(tasks[0]);
    expect(isComplete).toEqual(studyTask.is_complete);
  });
});
