import {GenericType} from './generic_type';
import {Task} from './task';

export interface Study extends GenericType {
  id: number;
  title: string;
  type: string;
  tasks: Task[];
}
