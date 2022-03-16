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
  WorkflowStatus, ApiService, MockEnvironment, mockWorkflowSpecCategory0, mockCategoryMetaData
} from 'sartography-workflow-lib';
import {DashboardComponent} from './dashboard.component';
import {browser} from "protractor";

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

  it('should filter out hidden categories', () => {
    expect(component.categoryTabs).toBeDefined();
    mockWorkflowSpecCategory0.meta = mockCategoryMetaData;
    fixture.detectChanges();
    console.log(component.categoryTabs[0].meta.state);
    fixture.whenStable().then(() => {
      expect(component.categoryTabs.length).toEqual(3);
    });
  })

});
