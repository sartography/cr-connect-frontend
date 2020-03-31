import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {
  ApiService,
  MockEnvironment,
  mockStudies,
  mockWorkflow0,
  mockWorkflows, mockWorkflowSpecCategories,
  mockWorkflowSpecs, mockWorkflowStats,
  mockWorkflowStats0
} from 'sartography-workflow-lib';
import {DashboardComponent} from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatTabsModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
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
});
