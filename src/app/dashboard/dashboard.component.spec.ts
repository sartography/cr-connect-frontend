import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {
  mockStudies, UserService,
  mockWorkflowSpecCategories,
  mockWorkflowMeta0, mockWorkflowMeta1,
  WorkflowState,
  WorkflowStatus, ApiService, MockEnvironment
} from 'sartography-workflow-lib';
import {DashboardComponent} from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const mockEnvironment = new MockEnvironment();


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatTabsModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        UserService,
        {provide: 'APP_ENVIRONMENT', useValue: mockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.study = mockStudies[0];
    fixture.detectChanges();

    expect(component.categoryTabs).toBeTruthy();
    expect(component.categoryTabs.length).toEqual(mockWorkflowSpecCategories.length);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get state label', () => {
    mockWorkflowMeta0.state = null;
    expect(component.getStateLabel(mockWorkflowMeta0)).toBeUndefined();

    Object.keys(WorkflowState).forEach(k => {
      mockWorkflowMeta0.state = WorkflowState[k];
      expect(component.getStateLabel(mockWorkflowMeta0)).toBeDefined();
    });
  });

  it('should get status label', () => {
    mockWorkflowMeta1.status = null;
    expect(component.getStatusLabel(mockWorkflowMeta1)).toBeUndefined();

    Object.keys(WorkflowStatus).forEach(k => {
      mockWorkflowMeta1.status = WorkflowStatus[k];
      expect(component.getStatusLabel(mockWorkflowMeta1)).toBeDefined();
    });
  });
});
