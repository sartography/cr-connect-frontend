import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {mockWorkflowTask0} from 'sartography-workflow-lib';
import {WorkflowStepsMenuListComponent} from './workflow-steps-menu-list.component';

describe('WorkflowStepsMenuListComponent', () => {
  let component: WorkflowStepsMenuListComponent;
  let fixture: ComponentFixture<WorkflowStepsMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowStepsMenuListComponent],
      imports: [
        MatIconModule,
        MatListModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowStepsMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit task when selected', () => {
    const emitSpy = spyOn(component.taskSelected, 'emit').and.stub();
    component.selectTask(mockWorkflowTask0.id);
    expect(emitSpy).toHaveBeenCalledWith(mockWorkflowTask0.id);
  });
});
