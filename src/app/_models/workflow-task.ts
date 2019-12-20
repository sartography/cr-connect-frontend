import {GenericType} from './generic-type';
import {BpmnFormJson} from './json';

export enum WorkflowTaskState {
  FUTURE = 'FUTURE',
  WAITING = 'WAITING',
  READY = 'READY',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  LIKELY = 'LIKELY',
  MAYBE = 'MAYBE',
}

export interface WorkflowTask extends GenericType {
  name: string;
  title: string;
  documentation: string;
  state: WorkflowTaskState;
  type: string;
  form: BpmnFormJson;
}
