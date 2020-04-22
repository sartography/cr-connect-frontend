import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {
  mockStudies,
  mockWorkflowSpecCategories,
  mockWorkflowStats0, mockWorkflowStats1,
  WorkflowState,
  WorkflowStatus
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

  it('should get state label', () => {
    mockWorkflowStats0.state = null;
    expect(component.getStateLabel(mockWorkflowStats0)).toBeUndefined();

    Object.keys(WorkflowState).forEach(k => {
      mockWorkflowStats0.state = WorkflowState[k];
      expect(component.getStateLabel(mockWorkflowStats0)).toBeDefined();
    });
  });

  it('should get status label', () => {
    mockWorkflowStats1.status = null;
    expect(component.getStatusLabel(mockWorkflowStats1)).toBeUndefined();

    Object.keys(WorkflowStatus).forEach(k => {
      mockWorkflowStats1.status = WorkflowStatus[k];
      expect(component.getStatusLabel(mockWorkflowStats1)).toBeDefined();
    });
  });
});
