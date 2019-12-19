// TODO: Add WorkflowSpecs and Workflows
import {WorkflowSpec} from '../../_models/workflow';

export const mockWorkflowSpec0: WorkflowSpec = {
  id: '0', name: 'Everything', description: 'Do all the things', task_spec_ids: ['0', '1', '2', '3']
};
export const mockWorkflowSpec1: WorkflowSpec = {
  id: '1', name: 'Some things', description: 'Do a few things', task_spec_ids: ['0', '2', '3']
};
export const mockWorkflowSpec2: WorkflowSpec = {
  id: '2', name: 'One thing', description: 'Do just one thing', task_spec_ids: ['1']
};

export const mockWorkflowSpecs: WorkflowSpec[] = [
  mockWorkflowSpec0,
  mockWorkflowSpec1,
  mockWorkflowSpec2,
];
