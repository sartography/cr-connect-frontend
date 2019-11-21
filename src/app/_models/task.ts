import {GenericType} from './generic-type';
import {Links} from './links';

export enum TaskState {
  Future = 'FUTURE',
  Likely = 'LIKELY',
  Maybe = 'MAYBE',
  Waiting = 'WAITING',
  Ready = 'READY',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
}

export interface TaskSpecs {
  [key: string]: TaskSpec;
}

export interface TaskSpec extends GenericType {
  name: string;
  description: string;
  _links?: Links;
}

export interface Task extends GenericType {
  label: string;
  task_spec_id: number;
  state_name: TaskState;
  task_spec?: TaskSpec;
  children?: Task[];
  _links?: Links;
}
