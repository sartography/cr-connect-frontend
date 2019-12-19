// TODO: Refactor this to be about TaskSpecs
import {Task, TaskState} from '../../_models/task';

export const mockTask0: Task = {id: '0', label: 'Do the dishes', task_spec_id: '1', state_name: TaskState.Future};
export const mockTask1: Task = {id: '2', label: 'Take out the trash', task_spec_id: '3', state_name: TaskState.Future};
export const mockTask2: Task = {id: '4', label: 'Make the coffee', task_spec_id: '5', state_name: TaskState.Future};
export const mockTask3: Task = {id: '6', label: 'Do the monster mash', task_spec_id: '7', state_name: TaskState.Future};

export const mockTasks: Task[] = [
  mockTask0,
  mockTask1,
  mockTask2,
  mockTask3,
];
