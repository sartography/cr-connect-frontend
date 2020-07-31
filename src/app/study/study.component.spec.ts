import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ChartsModule} from 'ng2-charts';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockStudy0,
  ProtocolBuilderStatus,
  ProtocolBuilderStatusLabels
} from 'sartography-workflow-lib';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {LoadingComponent} from '../loading/loading.component';
import {StudyComponent} from './study.component';

describe('StudyComponent', () => {
  let component: StudyComponent;
  let fixture: ComponentFixture<StudyComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        LoadingComponent,
        StudyComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        ChartsModule,
        HttpClientTestingModule,
        MatDividerModule,
        MatIconModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0'}))},
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(StudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/study/0');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockStudy0);
    expect(component.study).toBeTruthy();
    expect(component.study.id).toEqual(mockStudy0.id);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get status label', () => {
    expect(component.getStatusLabel(ProtocolBuilderStatus.ACTIVE))
      .toEqual(ProtocolBuilderStatusLabels.ACTIVE);
  });

  it('should check for workflows', () => {
    expect(component.allWorkflows.length).toBeGreaterThan(0);
  });

  it('should select category', () => {
    const catId = component.study.categories[0].id;
    const loadStudySpy = spyOn(component, 'loadStudy').and.stub();
    component.selectCategory(catId);
    expect(component.selectedCategoryId).toEqual(catId);
    expect(component.isCategorySelected).toBeTrue()
    expect(loadStudySpy).not.toHaveBeenCalled();

    loadStudySpy.calls.reset();

    component.selectCategory(undefined);
    expect(component.selectedCategoryId).toBeUndefined();
    expect(component.selectedWorkflowId).toBeUndefined();
    expect(component.isCategorySelected).toBeFalse()
    expect(loadStudySpy).toHaveBeenCalled();
  });


  it('should select workflow', () => {
    const workflowId = component.study.categories[0].workflows[0].id;
    const loadStudySpy = spyOn(component, 'loadStudy').and.stub();
    component.selectWorkflow(workflowId);
    expect(component.isWorkflowSelected).toBeTrue()
    expect(component.selectedWorkflowId).toEqual(workflowId);
    expect(loadStudySpy).not.toHaveBeenCalled();

    loadStudySpy.calls.reset();

    component.selectWorkflow(undefined);
    expect(component.isWorkflowSelected).toBeFalse()
    expect(component.selectedWorkflowId).toBeUndefined();
    expect(loadStudySpy).toHaveBeenCalled();
  });

});
