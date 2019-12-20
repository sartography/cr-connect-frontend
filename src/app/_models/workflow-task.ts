import {GenericType} from './generic-type';
import {BpmnFormJson} from './json';

export enum WorkflowTaskState {
  DONE = 'task'
}

export interface WorkflowTask extends GenericType {
  name: string;
  state: WorkflowTaskState;
  type: string;
  form: BpmnFormJson;
}
